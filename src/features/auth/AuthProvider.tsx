import React, { PropsWithChildren, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  navigateTo?: string
}

/** 
 * AuthProvider is authentication wrapper for the component which redirect to login page if user is not authenticated
 * and adds the redirect query parameter to the url. When the users get authenticated then the redirect parameter is used to
 * redirect the user to destination path.
 * AuthProvider is used for providing the authentication required by the particular component.
*/

export default function AuthProvider({ navigateTo = '/', children }: PropsWithChildren<AuthProviderProps>) {
  const auth = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const checkAuthentication = () => {
    if (!auth.isAuthenticated) {
      if (navigateTo === '/') {
        navigateTo = navigateTo + `?redirect=${window.location.pathname}`;
      }
      navigate(navigateTo);
    }
  }

  useEffect(() => {
    checkAuthentication();
  });

  return (
    <>
      {auth.isAuthenticated && children}
    </>
  );
}
