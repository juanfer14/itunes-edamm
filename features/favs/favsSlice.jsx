import { createSlice } from '@reduxjs/toolkit';

export const favsSlice = createSlice({
    name: 'favs',
    initialState: {
        favs: [],
    },
    reducers: {
        addFav: (state, action) => {
            if (!state.favs.includes(action.payload)) {
                state.favs.push(action.payload);
            }
        },
        removeFav: (state, action) => {
            state.favs = state.favs.filter(fav => fav.trackId != action.payload.trackId);
        },
        resetFavs: (state, action) => {
            state.favs = [];
        }
    },
});

export const { addFav, removeFav, resetFavs } = favsSlice.actions;

export default favsSlice.reducer;