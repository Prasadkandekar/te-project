import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import ideasSlice from './slices/ideasSlice';
import connectionsSlice from './slices/connectionsSlice';
import resourcesSlice from './slices/resourcesSlice';
import bookingsSlice from './slices/bookingsSlice';
import pitchesSlice from './slices/pitchesSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ideas: ideasSlice,
    connections: connectionsSlice,
    resources: resourcesSlice,
    bookings: bookingsSlice,
    pitches: pitchesSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;