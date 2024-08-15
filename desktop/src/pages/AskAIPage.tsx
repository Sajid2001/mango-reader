import { IconMoon } from "@tabler/icons-react";

const AskAIPage = () => {
  return (
    <div className="w-full flex ">
      <div className=" flex flex-wrap *:pt-3 pb-4">
        <h1 className="text-3xl pl-7 mr-2 font-bold ">Ask AI</h1>
        <div className="flex m-1 *:mr-2">
          <button className="py-1  mb-3 font-semibold text-lg px-5 text-background bg-accent rounded-lg active:bg-slate-700">
            Clear
          </button>
          <button className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">
            Export
          </button>
          <button className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">
            Import
          </button>
          <button className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">
            Layout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskAIPage;
