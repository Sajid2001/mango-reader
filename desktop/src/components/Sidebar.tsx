import SidebarButton from "./SidebarButton";

const Sidebar = () => {
    return (  
        <div className='grid grid-cols-1'>
            <SidebarButton />
            <SidebarButton />
            <SidebarButton />
            <SidebarButton />
            <SidebarButton />
        </div>
        
    );
}
 
export default Sidebar;