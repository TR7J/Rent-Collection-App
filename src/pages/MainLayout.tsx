import { Outlet } from "react-router-dom";
import {
  YouTubeSidebar,
  YouTubeSidebarProvider,
  useSidebar,
} from "../components/sidebar/Sidebar";
import { SidebarOverlay } from "../components/sidebar/SidebarOverlay";
import { YouTubeBottomNav } from "../components/sidebar/BottomNavbar";

const MainLayout = () => {
  return (
    <YouTubeSidebarProvider>
      <MainContent />
      <SidebarOverlay />
      <YouTubeBottomNav />
    </YouTubeSidebarProvider>
  );
};

const MainContent = () => {
  const { expanded } = useSidebar(); // Get sidebar state

  return (
    <div className="min-h-screen bg-youtube-background text-youtube-text flex w-full">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
          expanded ? "lg:w-[12%]" : "lg:w-[5%]"
        }`}
      >
        <YouTubeSidebar />
      </div>

      {/* Main Content - Always Takes Remaining Space */}
      <main className="flex-grow transition-all duration-300 ease-in-out pb-16 lg:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
