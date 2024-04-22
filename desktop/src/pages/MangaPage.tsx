import { IconCheck, IconClock, IconPlayerPlay } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MangaPage = () => {

    
    interface MangaDetails {
        id: number;
        mangaka: string;
        alternateNames: string;
        name: string;
        genres: string[];
        description: string;
        ongoing: boolean;
        totalChapters: number;
        bannerImage: string;
    }
    
    const { id } = useParams();

    const [manga, setManga] = useState<MangaDetails>({
        id: -1,
        mangaka: "Akira Toriyama",
        alternateNames: "Duragon no Hoshi",
        name: "Dragon Ball Z",
        genres: ["Action", "Adventure", "Hispanic"],
        description: "",
        ongoing: true,
        totalChapters: 100,
        bannerImage: "https://media.kitsu.io/manga/38/cover_image/large-bd52b8f2fb81d3cf99b4fbe4c072d2b1.jpeg"
    });
    

    useEffect(() => {
        console.log(id)
        fetch("http://localhost:3001/manga?id="+id)
            .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // Map fetched data to Post model
            const mappedData: MangaDetails = {
                id: data[0].id,
                mangaka: data[0]['author(s)'],
                alternateNames: data[0].alternateNames,
                name: data[0].name,
                genres: data[0].genres.split(", "),
                description: data[0].descriptions,
                ongoing: true,
                totalChapters: data[0].totalChapters,
                bannerImage: data[0].bannerImage
            }
            console.log(mappedData)
            setManga(mappedData);
          })
          .catch(error => console.error('Error fetching data:', error));
          
    }, []);


    return ( 

        
        
        <div>
            <div>
                <div className="bg-slate-200 h-48 w-dull">
                    <img src={manga.bannerImage} alt="" className="h-full object-cover w-full"/>
                </div>
                <div className="flex flex-col mt-2">
                    <div className=" pl-4 pt-4 pr-2 pb-2 inline-block align-baseline">
                        <p className="text-3xl font-bold">{manga.name}<span className="pl-3 font-semibold text-sm">{manga.alternateNames}</span></p>
                    </div>
                    <div className="flex px-3">
                        { manga.genres != null ?
                            manga.genres.map((genre) => (
                                <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                                    {genre}
                                </div>
                            ))
                            :
                            <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                                No Associated Genres
                            </div>
                        }
                    </div>
                    
                    <div className="flex *:px-4 *:py-2">
                        <p className="font-semibold text-md">{manga.description}</p>
                    </div>

                    <div className="flex *:px-4 font-semibold">
                        <p>{manga.mangaka}</p>
                        <div className="font-bold">{manga.ongoing ? 
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
                        <p>{manga.totalChapters != null || manga.totalChapters == 0 ? "No totalChapters" : manga.totalChapters == 1 ? "1 Chapter" : `${manga.totalChapters} totalChapters`}</p>
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