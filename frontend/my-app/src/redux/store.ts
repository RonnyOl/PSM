"use client";

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';

import storage from 'redux-persist/lib/storage'; // para usar localStorage
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// Configuración de persistencia para el reducer "user"
const persistConfig = {
  key: 'root',    // nombre clave en storage
  storage,
  whitelist: ['user'], // solo se persistirá el slice user
};

const rootReducer = combineReducers({
  user: userReducer,
});

// Aplica persistReducer a rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist usa algunas acciones que pueden fallar la verificación serializable
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
