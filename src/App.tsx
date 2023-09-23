import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './modules/home/pages/HomePage';
import Navbar from './shared/components/Navbar';
import Alert from './features/alert/Alert';
import RequestClient from './infra/client';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { initAuthorization } from './features/auth/authSlice';
import AppController from "./AppController";
import { loadThemeData } from './features/theme/themeSlice';
import ProfilePage from './modules/profile/pages/ProfilePage';
import { setProfileContent } from './features/content/contentSlice';
import AuthProvider from './features/auth/AuthProvider';
import { setTimelineFeeds } from './features/timeline/timelineSlice';
import { setReellineFeeds } from './features/reelline/reellineSlice';
import ReelPage from './modules/reels/pages/ReelPage';

function App() {
  const dispatch = useAppDispatch();
  const content = useAppSelector(state => state.content);

  const appController = AppController.getInstance();

  // START - configuration for csrf token
  const [isCsrfConfigured, setCsrfConfigured] = useState(false);

  const configCsrfToken = async () => {
    const data = RequestClient.get({
      url: '/token/csrf'
    });
    const response = RequestClient.collect(data);
    return response.success();
  }

  useEffect(() => {
    return () => {
      if (!isCsrfConfigured) {
        configCsrfToken();
        setCsrfConfigured(true);
      }
    }
  });
  // END - configuration for csrf token

  const fetchContent = useCallback(async () => {
    if (content.profile == null) {
      const content = await Promise.all([
        appController.fetchProfile(),
        appController.fetchTimelineFeeds(),
        appController.fetchReellineFeeds(),
      ]);
      dispatch(setProfileContent(content[0]));
      dispatch(setTimelineFeeds(content[1]));
      dispatch(setReellineFeeds(content[2]));
    }
  }, [content.profile, appController, dispatch]);

  useEffect(() => {
    // initializing app
    appController.initializeApp();

    // listening for auth state whether the user is authenticated or not
    appController.authStateChangeListener((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        dispatch(initAuthorization());
        fetchContent();

        // updating fcm messaging token
        appController.updateMessagingToken();
      }
    });

    // loading app theme
    dispatch(loadThemeData());
  }, [appController, fetchContent, dispatch]);


  return (
    <div className="app">
      <Alert />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<HomePage form='login' />} />
          <Route path='/signup' element={<HomePage form='signup' />} />
          <Route path='/recovery' element={<HomePage form='recovery' />} />
          <Route path='/profile/:uid' element={
            <AuthProvider>
              <ProfilePage />
            </AuthProvider>
          } />
          <Route path='/reel' element={
            <AuthProvider>
              <ReelPage />
            </AuthProvider>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
