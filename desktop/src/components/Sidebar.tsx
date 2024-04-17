import {  IconBooks,  IconHistory,  IconRobot, IconSearch, IconSettings } from "@tabler/icons-react";
import SidebarButton from "./SidebarButton";

const Sidebar = () => {

    const strikeWidth = 1.7;
    const color = "white";
    const size = 42;

    return (  
        <div className='grid grid-cols-1 mt-2'>
            
            <SidebarButton 
                icon={<IconBooks strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconSearch strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconSettings strokeWidth={strikeWidth}  color={color} size={size} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconHistory strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconRobot strokeWidth={strikeWidth} color={color} size={size} />} 
                routeName="hello world"
            />
        </div>
        
    );
}
 
export default Sidebar;