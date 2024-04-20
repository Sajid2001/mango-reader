import { IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
    return (  
        <div className="w-full flex-col">
            <div className="flex">
                <h1 className="text-3xl p-4 font-bold">Settings</h1>
                <button className="font-semibold text-lg px-4 m-5 text-white  bg-slate-900 rounded-lg active:bg-slate-700">Reset</button>
            </div>

                
            <div className="flex w-full border-b-4 ">
                <p className="text-2xl p-4 border-b-4 border-slate-600">General</p>
                <p className="text-2xl p-4 border-b-4 border-slate-300">Reader</p>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold">Update</h3>
                <ul className="px-4 *:font-semibold ">
                    <li><input type="checkbox" className=" w-6 h-6 bg-slate-100 border-slate-100 rounded-full focus:ring-blue-500 focus:ring-2"/> Update Automatically</li>
                    <li><input type="checkbox" className=" w-6 h-6 bg-slate-100 border-slate-100 rounded-full focus:ring-blue-500 focus:ring-2" /> Refresh on startup</li>
                </ul>
            </div>

            <div>
                <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown hover <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
                </button>

                <div id="dropdownHover" className="z-50  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                    <li>
                        <p  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</p>
                    </li>
                    
                    </ul>
                </div>
            </div>
            
            
            
        </div>
    );
}
 
export default SettingsPage;