import { createSlice } from '@reduxjs/toolkit';


export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        actual: 'light',
    },
    reducers: {
        setTheme: (state, action) => {
            state.actual = action.payload;
        },
        toggle: (state, action) => {
            state.actual = state.actual === 'light' ? 'dark' : 'light';
        }

    },
});

export const { setTheme, toggle } = themeSlice.actions;

export default themeSlice.reducer;