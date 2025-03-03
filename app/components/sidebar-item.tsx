import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  paths: string[];
}

export function SidebarItem({ icon, label, paths }: SidebarItemProps) {
  const location = useLocation();
  const isActive = paths.some((path) => location.pathname.startsWith(path)); // Check multiple paths

  return (
    <Link
      to={paths[0]} // Default to the first path
      className={`flex flex-row gap-4 mx-4 py-2 px-6 rounded-md transform duration-200 
        ${
          isActive
            ? "bg-[#3A57E8] text-white scale-105"
            : "hover:scale-105 hover:bg-[#3A57E8] hover:text-white"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
