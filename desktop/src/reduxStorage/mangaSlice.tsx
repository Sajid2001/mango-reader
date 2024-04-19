import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MangaDetails {
    mangaId: string;
    title: string;
    totalChapters: number;
    image: string;
}

interface MangaData {
    manga: MangaDetails[];
}

const initialState: MangaData = {
    manga: [],
}

const mangaSlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        setMangaData: (state, action: PayloadAction<MangaDetails>) => {
            state.manga.push(action.payload);
        },

        resetMangaData: (state) => {
            state.manga = [];
        }
        
    }
});

export default mangaSlice.reducer;