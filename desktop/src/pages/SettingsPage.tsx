
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const SettingsPage = () => {

    
    const location = useLocation();
    const navigate = useNavigate();

    return (  
        <div className="h-screen w-full flex-col overflow-y-auto">
            <div className="flex">
                <h1 className="text-3xl p-4 font-bold">Settings</h1>
                <button className="font-semibold text-lg px-4 m-5 text-white  bg-slate-900 rounded-lg active:bg-slate-700">Reset</button>
            </div>

                
            <div className="flex w-full border-b-2 border-slate-300 mb-4 *:-mt-4">
                <button onClick={() => navigate("/settings/general")} disabled={location.pathname === "/settings/general"} className="transition ease-in-out disabled:border-b-4 disabled:border-black text-2xl p-4 border-1 border-slate-600">General</button>
                <button onClick={() => navigate("/settings/reader")}  disabled={location.pathname === "/settings/reader"}  className="transition ease-in-out disabled:border-b-4 disabled:border-black text-2xl p-4 border-1 border-slate-300">Reader</button>
            </div>
            <div className="">
            <Outlet/>
            </div>
        
            
            
            
        </div>
    );
}
 
export default SettingsPage;