import { IconRobot } from "@tabler/icons-react";
import React from "react";

interface Props {
    Icon: React.ElementType
}

const SidebarButton = () => {
    return (  
        <div className='transition ease-in-out duration-300 text-3xl text-white font-sans bg-slate-600 bg w-14 h-14 hover:scale-110 my-1 mx-2 rounded-full flex justify-center items-center'>
            <IconRobot color="white" size={42} />
        </div>
        
    );
}
 
export default SidebarButton;