import React from "react";
import { Link, NavLink } from "react-router-dom";

interface SidebarButtonProps {
    icon?: React.ReactNode;
    pageName?: string;
    routeName: string;
}

const SidebarButton = ( { icon, routeName, pageName }: SidebarButtonProps) => {
    return (  
        <div className='transition ease-in-out duration-300 font-thin text-white bg-slate-600 bg w-14 h-14 hover:scale-110 my-1 mx-2 rounded-full flex justify-center items-center'>
            <button>
                
            </button>
            {icon}
        </div>
        
    );
}
 
export default SidebarButton;