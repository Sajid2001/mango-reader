import { IconMoon } from "@tabler/icons-react";

const AskAIPage = () => {
    return (  
        <div className="w-full flex ">
            <h1 className="text-3xl p-4 font-bold">Ask Just.io</h1>
            <div className="inline-flex m-1 *:my-3 *:mx-1 ">
                <button className="font-semibold text-lg px-5  bg-slate-900 rounded-lg active:bg-slate-700 text-slate-200">Clear</button>
                <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Export</button>
                <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Import</button>
                <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
            </div>
            
            
        </div>
    );
}
 
export default AskAIPage;