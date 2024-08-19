import React from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "./Tooltip";

interface SidebarButtonProps {
  icon?: React.ReactNode;
  pageName: string;
  routeName: string;
}

const SidebarButton = ({ icon, routeName, pageName }: SidebarButtonProps) => {
  const location = useLocation();

  const isActive =
    routeName === "/settings"
      ? location.pathname.includes(routeName)
      : location.pathname === routeName;

  return (
    <Tooltip text={pageName}>
      <Link
        to={routeName}
        className="rounded-full"
        data-placement="right"
        data-te-toggle="tooltip"
      >
        <div
          className={`transition ease-in-out duration-200 font-thin w-14 h-14 ${
            isActive
              ? "bg-background shadow-inner bg-opacity-70"
              : "hover:bg-background hover:shadow-inner"
          } my-1 ml-2 mr-3 rounded-full flex justify-center items-center`}
        >
          {icon}
        </div>
      </Link>
    </Tooltip>
  );
};

export default SidebarButton;
