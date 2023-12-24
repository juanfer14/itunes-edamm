import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favsReducer from './features/favs/favsSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    favs: favsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
