import { createSlice } from '@reduxjs/toolkit';

export const songSlice = createSlice({
    name: 'songs',
    initialState: {
        songs: [],
    },
    reducers: {
        addSongs: (state, action) => {
            state.songs.push(...action.payload);
        },
        resetSongs: (state, action) => {
            state.songs = [];
        }
    },
});

export const { addSongs, resetSongs } = songSlice.actions;

export default songSlice.reducer;