import { createSlice } from '@reduxjs/toolkit';


export const songSlice = createSlice({
    name: 'songs',
    initialState: {
        termSearch: '',
        songSelected: null,
        isSongSelected: false,
        songPlayed: null,
        isPlaying: false,
    },
    reducers: {
        setTerm: (state, action) => {
            state.termSearch = action.payload;
        },
        setSelectedSong: (state, action) => {
            state.songSelected = action.payload
        },
        setIsSongSelected: (state, action) => {
            state.isSongSelected = action.payload;
        },
        setSong: (state, action) => {
            state.songPlayed = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload
        }
    },
})

export const { setTerm, setSelectedSong, setIsSongSelected, setSong, setIsPlaying} = songSlice.actions;

export default songSlice.reducer;