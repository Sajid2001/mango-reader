import React from "react";
import { Link } from "react-router-dom";



interface SidebarButtonProps {
    icon?: React.ReactNode;
    pageName?: string;
    routeName: string;
    alreadyOn: boolean;
}

const SidebarButton = ( { icon, routeName, pageName, alreadyOn }: SidebarButtonProps) => {

    return (  
        <Link to={routeName} className="rounded-full" title={pageName} data-placement="right" data-te-toggle="tooltip">
            <div className={`transition ease-in-out duration-300 font-thin text-white w-14 h-14 ${ alreadyOn ?  "bg-slate-400 shadow-inner bg-opacity-70" : "hover:bg-slate-300" } my-1 ml-2 mr-3 rounded-full flex justify-center items-center`}>
                {icon}
            </div>
        </Link>
        
        
    );
}
 
export default SidebarButton;