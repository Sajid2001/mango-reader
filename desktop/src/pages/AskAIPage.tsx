import { IconMoon } from "@tabler/icons-react";

const AskAIPage = () => {
    return (  
        <div className="w-full flex ">
            <h1 className="text-3xl p-4 font-bold">Ask AI</h1>
            <button className="font-semibold text-lg px-3 m-3  bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
            <button className="font-semibold px-3 m-3  bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
            <input className="font-semibold w-1/3 h-8 mt-3 mx-2 p-3 py-5 mb-1  text-lg rounded-lg border-2 align-middle bg-slate-300 placeholder:text-black" placeholder="Search Library..."/>
            
            
        </div>
    );
}
 
export default AskAIPage;