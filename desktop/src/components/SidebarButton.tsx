import { IconRobot } from "@tabler/icons-react";
import React from "react";

interface SidebarButtonProps {
    icon?: React.ReactNode;
    routeName?: string;
}

const SidebarButton = ( { icon, routeName }: SidebarButtonProps) => {
    return (  
        <div className='transition ease-in-out duration-300 font-thin text-white bg-slate-600 bg w-14 h-14 hover:scale-110 my-1 mx-2 rounded-full flex justify-center items-center'>
            {icon}
        </div>
        
    );
}
 
export default SidebarButton;