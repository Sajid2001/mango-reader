import {  IconBooks,  IconHistory,  IconRobot, IconSearch, IconSettings } from "@tabler/icons-react";
import SidebarButton from "./SidebarButton";

const Sidebar = () => {
    return (  
        <div className='grid grid-cols-1 mt-2'>
            
            <SidebarButton 
                icon={<IconBooks color="white" size={42} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconSearch color="white" size={42} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconSettings color="white" size={42} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconHistory color="white" size={42} />} 
                routeName="hello world"
            />
            <SidebarButton 
                icon={<IconRobot color="white" size={42} />} 
                routeName="hello world"
            />
        </div>
        
    );
}
 
export default Sidebar;