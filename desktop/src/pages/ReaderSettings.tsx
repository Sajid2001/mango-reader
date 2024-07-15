import { IconArrowsHorizontal, IconArrowsVertical, IconBook, IconCircleArrowLeft, IconCircleArrowRight, IconSpacingVertical } from "@tabler/icons-react";
import { useState } from "react";

const ReaderSettings = () => {

    const iconSize = 24

    const [singlePage, setSinglePage] = useState<boolean>();
    const [fitHeight, setFitHeight] = useState<boolean>()
    const [leftToRight, setLeftToRight] = useState<boolean>()
    const [pageGap, setPageGap] = useState<number>(0)

    return ( 
        <div className="*:py-3 *:px-4">
            <div className="ml-4 ">
                <h3 className="text-xl font-bold pb-3 ">Profile</h3>
                <div className="ml-2">
                    <select className="p-1 bg-slate-200 *:bg-slate-100 rounded-lg pr-8">
                        <option value="mango">Default</option>
                        <option value="mango">Custom</option>
                    </select>
                    <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold">Create New Profile</button>

                </div>
            </div>

            <div className="ml-4 ">
                <h3 className="text-xl font-bold mb-4 ">Layout</h3>
                <h4 className="text-md font-bold pb-2">Page Style</h4>
                <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-slate-200 rounded-lg">
                    <button disabled={singlePage} onClick={() => setSinglePage(true)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold ">
                        <IconBook size={iconSize}/> 
                        Single Page
                    </button>
                    <button disabled={!singlePage} onClick={() => setSinglePage(false)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold">
                        <IconSpacingVertical size={iconSize}/> 
                        Long Strip
                    </button>
                </div>

                <h4 className="text-md font-bold pb-2">Page Gap</h4>
                <div className="ml-2 mb-4 w-full">
                    <input required value={pageGap} min={0} onChange={(e )=> setPageGap(e.target.valueAsNumber)} className="p-1 pl-1 w-[100px]  text-md bg-slate-200 rounded-lg font-semibold text-right pr-2 custom-number-input" type="number"/>
                    <span className="-ml-11 mr-6 font-semibold">px</span>
                    <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >Reset Margins</button>
                </div>

                <h4 className="text-md font-bold pb-2">Direction</h4>
                <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-slate-200 rounded-lg">
                    <button disabled={!leftToRight} onClick={() => setLeftToRight(false)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold ">
                        <IconCircleArrowLeft size={iconSize}/> 
                        Right To Left
                    </button>
                    <button disabled={leftToRight} onClick={() => setLeftToRight(true)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold">
                        <IconCircleArrowRight size={iconSize}/> 
                        Left To Right
                    </button>
                </div>

                <h4 className="text-md font-bold pb-2">Page Fit</h4>
                <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-slate-200 rounded-lg">
                    <button disabled={!fitHeight} onClick={() => setFitHeight(false)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold ">
                        <IconArrowsHorizontal size={iconSize}/> 
                        Fit Width
                    </button>
                    <button disabled={fitHeight} onClick={() => setFitHeight(true)} className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-black disabled:text-white font-semibold">
                        <IconArrowsVertical size={iconSize}/> 
                        Fit Height
                    </button>
                </div>

                <h3 className="text-xl font-bold pb-2 ">Keybinds</h3>
                <div className="*:w-full *:border-b-2 border-slate-500 font-semibold">
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Move Page Left</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >D</button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Move Page Right</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >A</button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Move Chapter Left</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >[</button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Move Chapter Right</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >]</button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Open Reader Sidebar</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >Tab</button>
                    </div>
                    <div className="flex items-center justify-between p-2">
                        <p className="align-bottom">Go Back</p>
                        <button className="ml-2 w-44 bg-slate-200 px-2 py-1 h-full rounded-lg font-semibold" >Esc</button>
                    </div>
                </div>

            </div>
        </div>
     );
}
 
export default ReaderSettings;