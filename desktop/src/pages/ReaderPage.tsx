import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ReaderPage = () => {

    const { mangaId, chapterId } = useParams();
    const [scans, setScans] = useState<string[]>();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/chapters/"+Number(mangaId)+"/"+Number(chapterId))
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    // Map fetched data to Post model
                    const mappedData = data.map((chapter: any) => chapter.scan_url);

                    setScans(mappedData);
                })
                .catch(error => console.error('Error fetching chapter data:', error));
    }, [mangaId, chapterId]);

    return ( 
        <div className="flex items-center justify-center h-screen w-screen bg-gray-200">
            <h1 className="text-3xl p-4 font-bold">Reader</h1>
            <Link to={`/manga/${mangaId}`} className="text-3xl p-4 font-bold">Back</Link>
            {
                scans != null
                ?
                <div>
                    {
                        scans.map((scan: string) => <img src={scan} alt=""/>)
                    }
                </div>
                :
                <div>
                    <p>Loading...</p>
                </div>
            }
        </div>
    );
}
 
export default ReaderPage;