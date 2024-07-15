
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";


const SettingsPage = () => {

    
    const location = useLocation();
    const navigate = useNavigate();


    return (  
        <div className="h-screen w-full flex-col overflow-y-auto">
            <div className=" flex flex-wrap *:pt-3 pb-4">
                <h1 className="text-3xl pl-7 mr-2 font-bold ">Settings</h1>
                <div className="flex m-1 *:mr-2">
                    <button className="py-1  mb-3 font-semibold text-lg px-5 text-white bg-slate-900 rounded-lg active:bg-slate-700">Reset To Default</button>
                    <button className="py-1  mb-3 font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Revert</button>
                    <button className="py-1  mb-3 font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Save Changes</button>
                </div>

                
                
            </div>

                
            <div className="flex w-full border-b-2 border-slate-300 mb-4 *:-mt-4">
                <button onClick={() => navigate("/settings/general")} disabled={location.pathname === "/settings/general"} className="transition ease-in-out disabled:border-b-4 disabled:border-black text-2xl p-4 border-1 border-slate-600">General</button>
                <button onClick={() => navigate("/settings/reader")}  disabled={location.pathname === "/settings/reader"}  className="transition ease-in-out disabled:border-b-4 disabled:border-black text-2xl p-4 border-1 border-slate-300">Reader</button>
            </div>
            <div className="">
                <Outlet />
            </div>
            
        </div>
    );
}
 
export default SettingsPage;