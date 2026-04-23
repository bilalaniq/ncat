import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// @ts-ignore
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// ----------------------------------------------------------------------
// FIXED COLOR PALETTE
// ----------------------------------------------------------------------
const FIXED_PALETTE = ["#05070f", "#1b1035", "#3b1d6b", "#7c3aed", "#f0abfc"];

// ----------------------------------------------------------------------
// MOBILE DETECTION & OPTIMIZATION FLAGS
// ----------------------------------------------------------------------
const isMobile = (() => {
  const ua = navigator.userAgent || '';
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(ua) ||
         window.innerWidth < 768;
})();

const PARTICLE_COUNT = isMobile ? 5000 : 20000;
const PIXEL_RATIO = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
const USE_POST_PROCESSING = !isMobile; // disable bloom/zoom on mobile
const POINT_SIZE_RANGE = isMobile ? [3, 12] : [5, 20];

// ----------------------------------------------------------------------
// SHADERS
// ----------------------------------------------------------------------
const vertexShader = `
  uniform float uTime;
  attribute vec3 color;
  attribute float size;
  varying vec4 vColor;
  void main(){
    vColor = vec4(color, 1.0);
    vec3 p = vec3(position);
    p.z = -150. + mod(position.z + uTime, 300.);
    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
    gl_PointSize = size * (-50.0 / mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
  }
`;

// ----------------------------------------------------------------------
// ZOOM BLUR PASS (unchanged, only used when post-processing is enabled)
// ----------------------------------------------------------------------
class ZoomBlurPass extends ShaderPass {
  declare uniforms: {
    tDiffuse: { value: THREE.Texture | null };
    strength: { value: number };
    center: { value: THREE.Vector2 };
  };

  constructor(strength = 0) {
    super({
      uniforms: {
        tDiffuse: { value: null },
        strength: { value: strength },
        center: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float strength;
        uniform vec2 center;
        varying vec2 vUv;

        void main() {
          vec4 color = vec4(0.0);
          float total = 0.0;
          vec2 dir = vUv - center;
          float dist = length(dir);
          dir = normalize(dir);

          for (float t = -5.0; t <= 5.0; t += 1.0) {
            float percent = t * strength * dist * 0.1;
            float weight = 1.0 - abs(percent) / (5.0 * strength * dist * 0.1);
            weight = max(0.0, weight);
            color += texture2D(tDiffuse, vUv + dir * percent) * weight;
            total += weight;
          }
          gl_FragColor = color / total;
        }
      `,
    } as any);
  }

  get strength() {
    return this.uniforms.strength.value;
  }
  set strength(value: number) {
    this.uniforms.strength.value = value;
  }
}

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------
const ParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const zoomBlurPassRef = useRef<ZoomBlurPass | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const uniformsRef = useRef<{ uTime: { value: number } }>({ uTime: { value: 0 } });
  const timeCoefRef = useRef<number>(1);
  const targetTimeCoefRef = useRef<number>(1);
  const pointerPosRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const animationFrameRef = useRef<number>(0);

  // Function to randomize colors (fixed palette)
  const randomizeColors = () => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
    const color = new THREE.Color();
    for (let i = 0; i < colorAttr.count; i++) {
      color.set(FIXED_PALETTE[Math.floor(Math.random() * FIXED_PALETTE.length)]);
      color.toArray(colorAttr.array, i * 3);
    }
    colorAttr.needsUpdate = true;
  };

  const setSpeed = (fast: boolean) => {
    targetTimeCoefRef.current = fast ? 100 : 1;
  };

  useEffect(() => {
    // Expose global controls
    (window as any).__updateParticleColors = randomizeColors;
    (window as any).__setParticleSpeed = setSpeed;

    if (!containerRef.current) return;

    // Renderer with optimized pixel ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Create geometry with mobile‑optimized count
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const v3 = new THREE.Vector3();
    const color = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      v3.set(
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(300)
      );
      v3.toArray(positions, i * 3);
      color.set(FIXED_PALETTE[Math.floor(THREE.MathUtils.randFloat(0, FIXED_PALETTE.length))]);
      color.toArray(colors, i * 3);
      sizes[i] = THREE.MathUtils.randFloat(POINT_SIZE_RANGE[0], POINT_SIZE_RANGE[1]);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Load sprite texture
    const textureLoader = new THREE.TextureLoader();
    const spriteTexture = textureLoader.load(
      'https://assets.codepen.io/33787/sprite.png',
      undefined,
      undefined,
      (err) => console.error('Texture load error:', err)
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: spriteTexture },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    uniformsRef.current = material.uniforms as any;

    const points = new THREE.Points(geometry, material);
    points.position.z = -150;
    scene.add(points);
    pointsRef.current = points;

    // Post‑processing setup (conditionally enabled)
    let composer: EffectComposer | null = null;
    let zoomBlurPass: ZoomBlurPass | null = null;

    if (USE_POST_PROCESSING) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 0, 0);
      bloomPass.threshold = 0;
      bloomPass.strength = 2;
      bloomPass.radius = 0;
      composer.addPass(bloomPass);

      zoomBlurPass = new ZoomBlurPass(0);
      composer.addPass(zoomBlurPass);
    }

    composerRef.current = composer;
    zoomBlurPassRef.current = zoomBlurPass;

    // Pointer move (tilt)
    const handlePointerMove = (e: PointerEvent) => {
      pointerPosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerPosRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (composer) composer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      const delta = clockRef.current.getDelta();
      timeCoefRef.current = THREE.MathUtils.lerp(timeCoefRef.current, targetTimeCoefRef.current, 0.02);
      uniformsRef.current.uTime.value += delta * timeCoefRef.current * 4;

      if (USE_POST_PROCESSING && zoomBlurPassRef.current) {
        zoomBlurPassRef.current.strength = timeCoefRef.current * 0.004;
      }

      if (pointsRef.current) {
        const da = 0.05;
        const tiltX = THREE.MathUtils.lerp(
          pointsRef.current.rotation.x,
          pointerPosRef.current.y * da,
          0.02
        );
        const tiltY = THREE.MathUtils.lerp(
          pointsRef.current.rotation.y,
          -pointerPosRef.current.x * da,
          0.02
        );
        pointsRef.current.rotation.set(tiltX, tiltY, 0);
      }

      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      delete (window as any).__updateParticleColors;
      delete (window as any).__setParticleSpeed;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleField;