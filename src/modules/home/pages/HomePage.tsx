import React, { useEffect } from 'react';
import '../styles/HomePage.css';
import Illustration from '../../../settings/constants/illustration';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import RecoveryForm from '../components/RecoveryForm';
import { useAppSelector } from '../../../redux/hooks';
import Dashboard from '../components/Dashboard';

interface HomePageProps {
  form: string;
}

/**
 * HomePage is the page component which helps in authentication and user dashboard feeds.
 */

export default function HomePage({ form }: HomePageProps) {
  const auth = useAppSelector(state => state.auth);

  const changeBodyBackgroundColor = () => {
    const body = document.querySelector('body');
    if (body !== null) {
      if (auth.isAuthenticated) {
        body.style.backgroundColor = 'var(--color-bg-grey)';
      } else {
        body.style.backgroundColor = 'var(--color-bg)';
      }
    }
  }

  useEffect(() => {
    changeBodyBackgroundColor();
  });

  return (
    <>
      {
        auth.isAuthenticated ?
          <Dashboard/>
          :
          <div className='home-container'>
            <div className="home-container-left">
              <img src={Illustration.chatdropConnections} alt="connection" />
            </div>
            <div className="home-container-right">
              {
                form === 'login' && <LoginForm />
              }
              {
                form === 'signup' && <SignupForm />
              }
              {
                form === 'recovery' && <RecoveryForm />
              }
            </div>
          </div>
      }
    </>
  )
}
