import React, {useState} from 'react';
import '../styles/AuthForm.css';
import TextButton from '../../../shared/ui/TextButton';
import LinkButton from '../../../shared/ui/LinkButton';
import IconTextButton from '../../../shared/ui/IconTextButton';
import Logo from '../../../settings/constants/logo';
import Divider from '../../../shared/ui/Divider';
import { useNavigate } from 'react-router-dom';
import { Validator } from '../../../infra/utils';
import { useAppDispatch } from '../../../redux/hooks';
import { showAlert } from '../../../features/alert/alertSlice';
import LoginFormController from '../controllers/LoginFormController';
import { setAuthenticated } from '../../../features/auth/authSlice';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({ email: '', password: '' });

  const loginController = new LoginFormController();

  const toSignup = () => navigate('/signup');
  const toRecovery = () => navigate('/recovery');

  const onUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const login = () => {
    if (!Validator.isEmail(user.email)) {
      dispatch(showAlert({
        message: 'Invalid Email',
        type: 'danger'
      }));
      return;
    }
    if (!Validator.isPassword(user.password)) {
      dispatch(showAlert({
        message: "Password must contains atleast one number and one character.",
        type: 'danger'
      }));
      return;
    }
    if (!(user.password.length >= 8 && user.password.length <= 32)) {
      dispatch(showAlert({
        message: "Password must be of 8 to 32 character.",
        type: 'danger'
      }));
      return;
    }

    loginController.login({
      email: user.email,
      password: user.password,
    }).then(response => {
      if (response.success()) {
        dispatch(setAuthenticated(true));
      } else {
        dispatch(showAlert({
          message: response.error(),
          type: 'danger'
        }));
      }
    }).catch(error => {
      dispatch(showAlert({
        message: "Something went wrong. Try again.",
        type: 'danger'
      }));
    });
  }


  return (
    <>
      <div className="auth-form">
        <h1 className='heading'>Login</h1>
        <span className='auth-input auth-instruction'>Enter the Login Credentials</span>
        <input type="email" name="email" id="email" className='input-text auth-input' placeholder='Your Email' value={user.email} onChange={onUserChange} />
        <input type="password" name="password" id="password" className='input-text auth-input' placeholder='Your Password' value={user.password} onChange={onUserChange} />
        <LinkButton className='forget-password-btn' label='Forget Password' onClick={toRecovery}/>
        <TextButton className='login-btn' label='Login' onClick={login}/>
        <LinkButton className='signup-btn' label="Don't have an account? Sign up" onClick={toSignup}/>
        <Divider label='or' />
        <IconTextButton className='google-signin-btn' icon={Logo.google} label='Sign in with Google' applyIconTheme={false}/>
      </div>
    </>
  )
}
