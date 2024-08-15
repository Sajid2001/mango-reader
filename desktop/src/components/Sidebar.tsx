import {
  IconBooks,
  IconHistory,
  IconRobot,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import SidebarButton from "./SidebarButton";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const hideSidebarRoutes = ["/reader"];

  const shouldHideSidebar = hideSidebarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const strikeWidth = 1.7;
  const size = 42;

  if (shouldHideSidebar) return null;

  return (
    <div className="grid grid-cols-1 mt-2">
      <SidebarButton
        icon={
          <IconBooks
            className="text-text"
            strokeWidth={strikeWidth}
            size={size}
          />
        }
        routeName="/"
        pageName="Library"
        alreadyOn={location.pathname === "/"}
      />
      <SidebarButton
        icon={
          <IconSearch
            className="text-text"
            strokeWidth={strikeWidth}
            size={size}
          />
        }
        routeName="/search"
        pageName="Search"
        alreadyOn={location.pathname === "/search"}
      />
      <SidebarButton
        icon={
          <IconHistory
            className="text-text"
            strokeWidth={strikeWidth}
            size={size}
          />
        }
        routeName="/history"
        pageName="History"
        alreadyOn={location.pathname === "/history"}
      />
      <SidebarButton
        icon={
          <IconRobot
            className="text-text"
            strokeWidth={strikeWidth}
            size={size}
          />
        }
        routeName="/askai"
        pageName="Ask AI"
        alreadyOn={location.pathname === "/askai"}
      />
      <SidebarButton
        icon={
          <IconSettings
            className="text-text"
            strokeWidth={strikeWidth}
            size={size}
          />
        }
        routeName="/settings/general"
        pageName="Settings"
        alreadyOn={location.pathname.includes("/settings")}
      />
    </div>
  );
};

export default Sidebar;
