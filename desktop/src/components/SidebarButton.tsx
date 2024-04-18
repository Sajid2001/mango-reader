import React from "react";
import { Link } from "react-router-dom";

interface SidebarButtonProps {
    icon?: React.ReactNode;
    pageName?: string;
    routeName: string;
}

const SidebarButton = ( { icon, routeName, pageName }: SidebarButtonProps) => {
    return (  
        <Link to={routeName} className="rounded-full" title={pageName} data-placement="right" data-te-toggle="tooltip">
            <div className='transition ease-in-out duration-300 font-thin text-white bg-slate-600 bg w-14 h-14 hover:scale-110 my-1 ml-2 mr-3 rounded-full flex justify-center items-center'>

                {icon}
            
            </div>
        </Link>
        
        
    );
}
 
export default SidebarButton;