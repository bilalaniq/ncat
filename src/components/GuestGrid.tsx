// src/components/GuestGrid.tsx
import React from 'react';

interface Guest {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
}

const guests: Guest[] = [
  { id: 1, name: "Olivia Chen", role: "Keynote Speaker, AI Ethics", imageUrl: "https://assets.codepen.io/16327/portrait-image-1.jpg" },
  { id: 2, name: "Liam Rodriguez", role: "Creative Director", imageUrl: "https://assets.codepen.io/16327/portrait-image-2.jpg" },
  { id: 3, name: "Sophia Khan", role: "Lead Technologist", imageUrl: "https://assets.codepen.io/16327/portrait-image-3.jpg" },
  { id: 4, name: "Mason Lee", role: "UX Research Lead", imageUrl: "https://assets.codepen.io/16327/portrait-image-4.jpg" },
  { id: 5, name: "Isabella Dupont", role: "Robotics Engineer", imageUrl: "https://assets.codepen.io/16327/portrait-image-5.jpg" },
  { id: 6, name: "Ethan Johnson", role: "Digital Artist", imageUrl: "https://assets.codepen.io/16327/portrait-image-6.jpg" },
];

const GuestGrid: React.FC = () => {
  return (
    <div className="w-full">
      {/* Large layout with performance optimizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-500 transition-colors duration-200 will-change-transform"
            style={{ transform: 'translateZ(0)' }} // GPU acceleration
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-800">
              <img
                src={guest.imageUrl}
                alt={guest.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ transform: 'translateZ(0)' }}
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                {guest.name}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                {guest.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestGrid;