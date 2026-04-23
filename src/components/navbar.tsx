import { TubeLightNavBar } from "./ui/tubelight-navbar";
import { House, BriefcaseBusiness, FolderGit2, Star } from "lucide-react";

const firstName = "Bilal";

// Remove 'id' – TubeLightNavBar only needs name, url, icon
const NavLinks = [
  { name: "Hero", url: "/#Hero", icon: House },
  { name: "About", url: "/#About", icon: BriefcaseBusiness },
  { name: "Event Agenda", url: "/#Agenda", icon: FolderGit2 },
  { name: "Team", url: "/#Team", icon: Star },
];

const Navbar = () => {
  return <TubeLightNavBar items={NavLinks} firstName={firstName} />;
};

export default Navbar;