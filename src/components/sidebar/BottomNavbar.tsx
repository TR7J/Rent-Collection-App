import React, { useContext } from "react";
import { Home, User, LogOut, Building, Key, UserCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Store } from "../../context/UserContext";
import { Link, useLocation } from "react-router-dom";
import { showToast } from "../../utils/toastUtils";
import { useSidebar } from "./Sidebar";

// Routes configuration
const ROUTES = {
  HOME: "/",
  TENANT: "/tenants",
  PROPERTIES: "/properties",
  RENTALS: "/rentals",
  SIGN_IN: "/login",
  /*   SETTINGS: "/settings",
    REPORT: "/report",
    HELP: "/help",
    FEEDBACK: "/feedback", */
};

type BottomNavItemProps = {
  icon: React.ElementType;
  text: string;
  to: string;

  onClick?: () => void;
};

export const BottomNavItem: React.FC<BottomNavItemProps> = ({
  icon: Icon,
  text,
  to,

  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to}>
      <button
        className={cn(
          "flex flex-col items-center justify-center px-2 py-1 w-full",
          isActive ? "text-violet-500" : "text-gray-900"
        )}
        onClick={onClick}
      >
        <Icon className="w-5 h-5 mb-1" />
        <span className="text-xs">{text}</span>
      </button>
    </Link>
  );
};

export const YouTubeBottomNav: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
  };

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { navigateTo } = useSidebar();

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    showToast("Log out Successful!", "success");
    navigateTo(ROUTES.SIGN_IN);
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-50 border-t border-youtube-border flex justify-around items-center py-2 px-1 z-40 w-screen">
        <BottomNavItem icon={Home} text="Home" to={ROUTES.HOME} />
        <BottomNavItem icon={User} text="Tenant" to={ROUTES.TENANT} />
        <BottomNavItem
          icon={Building}
          text="Properties"
          to={ROUTES.PROPERTIES}
        />
        <BottomNavItem icon={Key} text="Rentals" to={ROUTES.RENTALS} />
        <BottomNavItem
          icon={UserCircle}
          text="You"
          onClick={toggleUserMenu}
          to={"#"}
        />
      </div>

      {showUserMenu && (
        <div className="lg:hidden fixed bottom-16 right-4 bg-slate-50 rounded-sm p-4 shadow-lg z-50 w-56 border border-youtube-border mb-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{userInfo?.name}</div>
              <div className="text-xs text-gray-400">{userInfo?.role}</div>
            </div>
          </div>
          <div className="border-t border-youtube-border pt-3">
            <button
              className="flex items-center gap-2 text-sm text-youtube-text p-2 w-full hover:bg-youtube-hover rounded transition-colors"
              onClick={signoutHandler}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
