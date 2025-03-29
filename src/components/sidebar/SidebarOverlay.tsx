import React from "react";

import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";
import { useSidebar } from "./Sidebar";

export const SidebarOverlay: React.FC = () => {
  const { expanded, collapseSidebar } = useSidebar();
  const isMobile = useIsMobile();

  if (!isMobile || !expanded) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity",
        expanded ? "animate-fade-in" : "animate-fade-out"
      )}
      onClick={collapseSidebar}
      aria-hidden="true"
    />
  );
};
