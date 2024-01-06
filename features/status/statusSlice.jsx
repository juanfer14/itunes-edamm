import { createSlice } from '@reduxjs/toolkit';

export const statusSlice = createSlice({
    name: 'status',
    initialState: {
        moreLoading: false,
        noMore: false,
        offset: 0,
        error: false,
        load: false,
    },
    reducers: {
        setMoreLoading: (state, action) => {
            state.moreLoading = action.payload;
        },
        setNoMore: (state, action) => {
            state.noMore = action.payload;
        },
        setOffset: (state, action) => {
            state.offset = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setLoad: (state, action) => {
            state.load = action.payload
        }
    },
});

export const { setMoreLoading, setNoMore, setOffset, setError, setLoad } = statusSlice.actions;

export default statusSlice.reducer;