import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Flag,
  HelpCircle,
  MessageSquare,
  Menu,
  ChevronLeft,
  LogOut,
  User,
  Building,
  Key,
  CreditCard,
  PlugZap,
  ReceiptText,
  UserCircle,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { cn } from "../../lib/utils";
import { Store } from "../../context/UserContext";
import { showToast } from "../../utils/toastUtils";

// Routes configuration
const ROUTES = {
  HOME: "/",
  TENANT: "/tenants",
  PROPERTIES: "/properties",
  RENTALS: "/rentals",
  EXPENSES: "/expenses",
  PAYMENTS: "/payments",
  UTILITIES: "/utilities",
  SIGN_IN: "/login",
  /*   SETTINGS: "/settings",
  REPORT: "/report",
  HELP: "/help",
  FEEDBACK: "/feedback", */
};

type SidebarContextType = {
  expanded: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  currentPath: string;
  navigateTo: (path: string) => void;
};

const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleSidebar: () => {},
  collapseSidebar: () => {},
  expandSidebar: () => {},
  currentPath: ROUTES.HOME,
  navigateTo: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const YouTubeSidebarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(!isMobile);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => setExpanded((prev) => !prev);
  const collapseSidebar = () => setExpanded(false);
  const expandSidebar = () => setExpanded(true);

  const navigateTo = (path: string) => {
    if (isMobile) {
      collapseSidebar();
    }
    navigate(path);
  };

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
        currentPath,
        navigateTo,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

type SidebarItemProps = {
  icon: React.ElementType;
  text: string;
  route?: string;
  active?: boolean;
  onClick?: () => void;
  hideWhenCollapsed?: boolean;
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  route,
  active,
  onClick,
  hideWhenCollapsed = false,
}) => {
  const { expanded, currentPath, navigateTo } = useSidebar();

  // If active is not explicitly provided, determine based on route match
  const isActive =
    active !== undefined ? active : route && currentPath === route;

  if (!expanded && hideWhenCollapsed) {
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigateTo(route);
    }
  };

  return (
    <button
      className={cn(
        "sidebar-menu-button",
        !expanded && "flex-col py-2 h-auto",
        isActive && "active"
      )}
      onClick={handleClick}
    >
      <Icon className="sidebar-menu-icon" />
      <span
        className={cn("sidebar-menu-text", !expanded && "text-[10px] mt-1")}
      >
        {expanded
          ? text
          : text.length > 8
          ? `${text.substring(0, 8)}...`
          : text}
      </span>
    </button>
  );
};

export const SidebarDivider: React.FC = () => {
  return <div className="sidebar-divider" />;
};

export const SidebarSection: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { expanded } = useSidebar();

  return (
    <div className="py-1">
      {title && expanded && (
        <h3 className="px-4 text-xs font-medium text-gray-400 mb-1">{title}</h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};

export const UserInfoSection: React.FC = () => {
  const { expanded } = useSidebar();
  const { navigateTo } = useSidebar();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    showToast("Log out Successful!", "success");
    navigateTo(ROUTES.SIGN_IN);
  };

  return (
    <div className="p-3 mt-auto border-t border-youtube-border">
      {expanded ? (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <div className="text-xs font-medium">{userInfo?.name}</div>
              <div className="text-xs text-gray-400">{userInfo?.role}</div>
            </div>
          </div>
          <button
            className="text-xs flex items-center gap-2 text-gray-500 hover:text-youtube-text transition-colors py-1 px-1 rounded hover:bg-youtube-hover w-full"
            onClick={signoutHandler}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center mb-1">
            <User size={16} />
          </div>
          <button
            className="mt-1 text-[10px] text-gray-400 hover:text-youtube-text transition-colors flex flex-col items-center"
            onClick={signoutHandler}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const YouTubeSidebarToggle: React.FC = () => {
  const { toggleSidebar, expanded } = useSidebar();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center justify-center p-2 rounded-full hover:bg-youtube-hover transition-all duration-200"
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      {expanded ? <ChevronLeft size={22} /> : <Menu size={22} />}
    </button>
  );
};

export const YouTubeSidebar: React.FC = () => {
  const { expanded } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <aside
      className={cn(
        "sidebar-container fixed left-0 top-0 h-full bg-gray-200 z-40 flex flex-col",
        expanded ? "sidebar-expanded" : "sidebar-collapsed",
        isMobile ? "hidden" : ""
      )}
    >
      <div className="flex items-center p-2 border-b border-youtube-border">
        <YouTubeSidebarToggle />
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden flex items-center",
            expanded ? "w-auto" : "w-0 ml-0"
          )}
        >
          <span className="whitespace-nowrap text-xl font-semibold hover:text-gray-700 text-violet-500">
            Rentahub
          </span>
        </div>
        {!expanded && <div className="flex justify-center w-full"></div>}
      </div>

      <div className="overflow-y-auto flex-1 pb-2">
        <SidebarSection>
          <SidebarItem icon={Home} text="Home" route={ROUTES.HOME} />
          <SidebarItem icon={User} text="Tenant" route={ROUTES.TENANT} />
          <SidebarItem
            icon={Building}
            text="Properties"
            route={ROUTES.PROPERTIES}
          />
          <SidebarItem icon={Key} text="Rentals" route={ROUTES.RENTALS} />
        </SidebarSection>

        <SidebarDivider />

        <SidebarSection>
          <SidebarItem
            icon={ReceiptText}
            text="Expenses"
            route={ROUTES.EXPENSES}
          />
          <SidebarItem
            icon={CreditCard}
            text="Payments"
            route={ROUTES.PAYMENTS}
            hideWhenCollapsed={!expanded && true}
          />
          <SidebarItem
            icon={PlugZap}
            text="Utilities"
            route={ROUTES.UTILITIES}
            hideWhenCollapsed={!expanded && true}
          />
          <SidebarItem
            icon={UserCircle}
            text="Re-Login"
            route={ROUTES.SIGN_IN}
            hideWhenCollapsed={!expanded && true}
          />
        </SidebarSection>

        <SidebarDivider />

        {expanded && (
          <>
            <SidebarSection>
              <SidebarItem
                icon={Settings}
                text="Settings"
                /*  route={ROUTES.SETTINGS} */
              />
              <SidebarItem
                icon={Flag}
                text="Report" /* route={ROUTES.REPORT} */
              />
              <SidebarItem
                icon={HelpCircle}
                text="Help" /* route={ROUTES.HELP} */
              />
              <SidebarItem
                icon={MessageSquare}
                text="Feedback"
                /*    route={ROUTES.FEEDBACK} */
              />
            </SidebarSection>

            <SidebarDivider />

            <div className="px-4 py-3 text-xs text-gray-400">
              <div>© 2025 RentaHub </div>
            </div>
          </>
        )}
      </div>

      <UserInfoSection />
    </aside>
  );
};
