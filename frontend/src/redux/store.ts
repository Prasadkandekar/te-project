import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import authSlice from './slices/authSlice';
import ideasSlice from './slices/ideasSlice';
import connectionsSlice from './slices/connectionsSlice';
import resourcesSlice from './slices/resourcesSlice';
import bookingsSlice from './slices/bookingsSlice';
import pitchesSlice from './slices/pitchesSlice';
import notificationsSlice from './slices/notificationsSlice';
import validationSlice from './slices/validationSlice';
import roadmapSlice from './slices/roadmapSlice';
import caseStudiesSlice from './slices/caseStudiesSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  ideas: ideasSlice,
  connections: connectionsSlice,
  resources: resourcesSlice,
  bookings: bookingsSlice,
  pitches: pitchesSlice,
  notifications: notificationsSlice,
  validation: validationSlice,
  roadmap: roadmapSlice,
  caseStudies: caseStudiesSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
