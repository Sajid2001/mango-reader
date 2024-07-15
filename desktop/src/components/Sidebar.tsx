import {  IconBooks,  IconHistory,  IconRobot, IconSearch, IconSettings } from "@tabler/icons-react";
import SidebarButton from "./SidebarButton";
import { useLocation } from "react-router-dom";

const Sidebar = () => {

    const location = useLocation();

    const strikeWidth = 1.7;
    const color = "black";
    const size = 42;

    

    return (  
        <div className=' grid grid-cols-1 mt-2'>
            
            <SidebarButton 
                icon={<IconBooks strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/"
                pageName="Library"
                alreadyOn={location.pathname === "/"}
            />
            <SidebarButton 
                icon={<IconSearch strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/search"
                pageName="Search"
                alreadyOn={location.pathname === "/search"}
            />
            <SidebarButton 
                icon={<IconHistory strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/history"
                pageName="History"
                alreadyOn={location.pathname === "/history"}
            />
            <SidebarButton 
                icon={<IconSettings strokeWidth={strikeWidth}  color={color} size={size} />} 
                routeName="/settings/general"
                pageName="Settings"
                alreadyOn={location.pathname.includes("/settings")}
            />
            <SidebarButton 
                icon={<IconRobot strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/askai"
                pageName="Ask AI"
                alreadyOn={location.pathname === "/askai"}
            />
        </div>
        
    );
}
 
export default Sidebar;