import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


interface SidebarButtonProps {
    icon?: React.ReactNode;
    pageName?: string;
    routeName: string;
}

const SidebarButton = ( { icon, routeName, pageName }: SidebarButtonProps) => {

    const location = useLocation()

    return (  
        <Link to={routeName} className="rounded-full" title={pageName} data-placement="right" data-te-toggle="tooltip">
            <div className={`transition ease-in-out duration-300 font-thin text-white w-14 h-14 ${ location.pathname == routeName ?  "bg-slate-400 shadow-inner bg-opacity-70" : "hover:bg-slate-300" } my-1 ml-2 mr-3 rounded-full flex justify-center items-center`}>
                {icon}
            </div>
        </Link>
        
        
    );
}
 
export default SidebarButton;