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

  const strokeWidth = 1.7;
  const size = 42;

  if (shouldHideSidebar) return null;

  const buttons = [
    {
      icon: (
        <IconBooks
          className="text-text"
          strokeWidth={strokeWidth}
          size={size}
        />
      ),
      routeName: "/",
      pageName: "Library",
    },
    {
      icon: (
        <IconSearch
          className="text-text"
          strokeWidth={strokeWidth}
          size={size}
        />
      ),
      routeName: "/search",
      pageName: "Search",
    },
    {
      icon: (
        <IconHistory
          className="text-text"
          strokeWidth={strokeWidth}
          size={size}
        />
      ),
      routeName: "/history",
      pageName: "History",
    },
    // {
    //   icon: (
    //     <IconRobot
    //       className="text-text"
    //       strokeWidth={strokeWidth}
    //       size={size}
    //     />
    //   ),
    //   routeName: "/askai",
    //   pageName: "Ask AI",
    // },
    {
      icon: (
        <IconSettings
          className="text-text"
          strokeWidth={strokeWidth}
          size={size}
        />
      ),
      routeName: "/settings/general",
      pageName: "Settings",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-1 mt-2">
      {buttons.map((button, index) => (
        <SidebarButton
          key={index}
          icon={button.icon}
          routeName={button.routeName}
          pageName={button.pageName}
        />
      ))}
    </div>
  );
};

export default Sidebar;
