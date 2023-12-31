import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favsReducer from './features/favs/favsSlice';
import themeReducer from './features/styles/themeSlice'
import songSlice from './features/songs/songSlice'
import statusSlice from './features/status/statusSlice'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    timeout: null
};

const rootReducer = combineReducers({
    favs: favsReducer,
    theme: themeReducer,
    songs: songSlice,
    status: statusSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
