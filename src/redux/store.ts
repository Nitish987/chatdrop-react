import { configureStore } from '@reduxjs/toolkit';
import alertReducer from '../features/alert/alertSlice';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import contentReducer from '../features/content/contentSlice';
import timelineReducer from '../features/timeline/timelineSlice';
import reelineReducer from '../features/reelline/reellineSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    alert: alertReducer,
    auth: authReducer,
    content: contentReducer,
    timeline: timelineReducer,
    reelline: reelineReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch