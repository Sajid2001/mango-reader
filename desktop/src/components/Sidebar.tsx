import {  IconBooks,  IconHistory,  IconRobot, IconSearch, IconSettings } from "@tabler/icons-react";
import SidebarButton from "./SidebarButton";

const Sidebar = () => {

    const strikeWidth = 1.7;
    const color = "black";
    const size = 42;

    

    return (  
        <div className=' grid grid-cols-1 mt-2'>
            
            <SidebarButton 
                icon={<IconBooks strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/"
                pageName="Library"
            />
            <SidebarButton 
                icon={<IconSearch strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/search"
                pageName="Search"
            />
            <SidebarButton 
                icon={<IconHistory strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/history"
                pageName="History"
            />
            <SidebarButton 
                icon={<IconSettings strokeWidth={strikeWidth}  color={color} size={size} />} 
                routeName="/settings"
                pageName="Settings"
            />
            <SidebarButton 
                icon={<IconRobot strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="/askai"
                pageName="Ask AI"
            />
        </div>
        
    );
}
 
export default Sidebar;