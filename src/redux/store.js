import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from './AuthReducer';

import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, AuthReducer)

const store = configureStore({
  reducer: persistedReducer
})


export const persister = persistStore(store)

export default store;