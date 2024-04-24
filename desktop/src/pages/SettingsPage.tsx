

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
            
            </div>

            <div>
                
                <button id="dropdownHelperRadioButton" data-dropdown-toggle="dropdownHelperRadio" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown radio <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg></button>

                

            </div>
            
            
            
        </div>
    );
}
 
export default SettingsPage;