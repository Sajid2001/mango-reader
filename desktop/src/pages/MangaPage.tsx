import { IconCheck, IconClock, IconPlayCard, IconPlayerPlay } from "@tabler/icons-react";

const MangaPage = () => {

    const mangaka: string = "Akira Toriyama";
    const japaneseTitle: string  = "Duragon no Hoshi";
    const englishTitle: string  = "Dragon Ball Z";
    const tags: string[] = ["Action", "Adventure", "Hispanic"];
    const description: string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    const ongoing: boolean = true;
    const chapters: number = 100;


    return ( 


        
        <div>
            <div>
                <div className="bg-slate-200 h-48 w-dull">
                    <img src="https://media.kitsu.io/manga/cover_images/59240/large.jpg" alt="" className="object-fit"/>
                </div>
                <div className="flex flex-col mt-2">
                    <div className=" pl-4 pt-4 pr-2 pb-2 inline-block align-baseline">
                        <p className="text-3xl font-bold">{englishTitle}<span className="pl-3 font-semibold text-sm">{japaneseTitle}</span></p>
                    </div>
                    <div className="flex px-3">
                        {tags.map((tag) => (
                            <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                                {tag}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex *:px-4 *:py-2">
                        <p className="font-semibold">{description}</p>
                    </div>
                    <div className="flex *:px-4 font-semibold">
                        <p>{mangaka}</p>
                        <div className="font-bold">{ongoing ? 
                            <div className="flex">
                                <IconClock /> 
                                <p className="pl-1">Ongoing</p>
                            </div>  
                            : 
                            <div className="flex">
                                <IconCheck /> 
                                <p className="pl-1">Completed</p>
                            </div>  
                            }
                        </div>
                    </div>
                    <div className="flex border-b-2 p-4 font-bold border-slate-800 justify-between">
                        <p>{chapters != null || chapters == 0 ? "No Chapters" : chapters == 1 ? "1 Chapter" : `${chapters} Chapters`}</p>
                        <button className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end active:bg-slate-700"> <IconPlayerPlay className="pr-2"/> Start</button>

                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </div>
     );
}
 
export default MangaPage;