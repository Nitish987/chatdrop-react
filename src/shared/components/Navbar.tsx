// import { useEffect, useState } from 'react';
import '../styles/Navbar.css';
import Logo from '../../settings/constants/logo';
import Icons from '../../settings/constants/icons'
import IconTextButton from '../ui/IconTextButton';
import IconButton from '../ui/IconButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Avatar from '../utils/avatar';
import DropdownItem from '../ui/DropdownItem';
import NavbarController from '../controllers/NavbarController';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../../features/alert/alertSlice';
import { setAuthenticated } from '../../features/auth/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const profile = useAppSelector(state => state.content.profile);
  const navbarController = NavbarController.getInstance();

  // const toLogin = () => navigate('/');

  const profileDropdownAction = () => {
    const dropdown = document.getElementById('profile-dropdown')!;
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'flex';
    } else {
      dropdown.style.display = 'none';
    }
  }

  const logoutAccount = () => {
    navbarController.logoutAccount().then(success => {
      if (success) {
        profileDropdownAction();
        dispatch(setAuthenticated(false));
      } else {
        dispatch(showAlert({
          message: 'Something went wrong!.',
          type: 'danger'
        }))
      }
    });
  }

  return (
    <>
      <nav className='nav'>
        <div className="navbar">
          <div className="navbar-logo">
            <img src={Logo.chatdrop} alt="chatdrop" />
            <span>chatdrop</span>
          </div>
          <div className="navbar-tabs">
            {
              auth.isAuthenticated &&
              <>
                <div className='nav-tabs tabs-first'>
                  <IconTextButton showBorder={false} icon={Icons.home} label='Home' onClick={() => navigate('/')}/>
                  <IconTextButton showBorder={false} icon={Icons.chats} label='Chats' />
                  <IconTextButton showBorder={false} icon={Icons.add} label='Add' />
                  <IconTextButton showBorder={false} icon={Icons.notification} label='Notification' />
                </div>
                <div className='nav-tabs tabs-second'>
                  <IconButton showBorder={false} icon={Icons.home} label='Home' onClick={() => navigate('/')}/>
                  <IconButton showBorder={false} icon={Icons.chats} label='Chats' />
                  <IconButton showBorder={false} icon={Icons.add} label='Add' />
                  <IconButton showBorder={false} icon={Icons.notification} label='Notification' />
                </div>
              </>
            }
          </div>
          <div className='navbar-search'>
            <input className='input-text searchbar' type="text" placeholder='Search Something...' />
            <IconButton className='searchbar-btn' icon={Icons.search} label='Search' />
            {
              (auth.isAuthenticated && profile !== null) &&
              <IconButton className='profilebar-btn' icon={Avatar.get(profile.profile.gender!, profile.profile.photo!)} label='Profile' applyIconTheme={false} onClick={profileDropdownAction} />
            }
          </div>
        </div>
        {
          auth.isAuthenticated &&
          <div className='navbar-subtabs'>
            <IconTextButton showBorder={false} className='nav-subtab' icon={Icons.home} label='Home' onClick={() => navigate('/')}/>
            <IconTextButton showBorder={false} className='nav-subtab' icon={Icons.chats} label='Chats' />
            <IconTextButton showBorder={false} className='nav-subtab' icon={Icons.add} label='Add' />
            <IconTextButton showBorder={false} className='nav-subtab' icon={Icons.notification} label='Notification' />
          </div>
        }
        <div id='profile-dropdown' className="nav-profile-dropdown">
          <DropdownItem label='Profile' />
          <DropdownItem label='Settings' />
          <DropdownItem label='Logout' onClick={logoutAccount}/>
          <DropdownItem label='Close' onClick={profileDropdownAction} />
        </div>
      </nav>
    </>
  )
}
