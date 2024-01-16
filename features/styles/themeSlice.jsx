import { createSlice } from '@reduxjs/toolkit';


export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        actual: 'light',
        isDark: false,
        loading: false
    },
    reducers: {
        setTheme: (state, action) => {
            state.actual = action.payload;
            state.isDark = action.payload === 'dark';
        },
        toggle: (state, action) => {
            state.actual = state.actual === 'light' ? 'dark' : 'light';
            state.isDark = state.actual === 'dark';
            state.loading = true;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }

    },
});

export const { setTheme, toggle, setLoading } = themeSlice.actions;

export default themeSlice.reducer;