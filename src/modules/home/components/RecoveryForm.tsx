import React, { useState } from 'react';
import '../styles/AuthForm.css';
import TextButton from '../../../shared/ui/TextButton';
import LinkButton from '../../../shared/ui/LinkButton';
import { useNavigate } from 'react-router-dom';
import { Validator } from '../../../infra/utils';
import { useAppDispatch } from '../../../redux/hooks';
import { showAlert } from '../../../features/alert/alertSlice';
import RecoveryFormController from '../controllers/RecoveryFormController';

export default function RecoveryForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState({ email: '', otp: '', password: '', re_password: '' });
  const [resentOtpBtn, setResentOtpBtn] = useState({ text: 'Resent OTP', disabled: true });
  const [recoveryStep, setRecoveryStep] = useState(1)

  const recoveryController = new RecoveryFormController();

  const toLogin = () => navigate('/');

  const onRecoveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecovery({ ...recovery, [e.target.name]: e.target.value });
  }

  const onBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    switch (recoveryStep) {
      case 2:
        setRecoveryStep(1);
        break;
      case 3:
        setRecoveryStep(2);
        break;
      default:
        setRecoveryStep(1);
        break;
    }
  }

  const changeFormAccordingly = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    switch (recoveryStep) {
      case 1:
        if (!Validator.isEmail(recovery.email)) {
          dispatch(showAlert({
            message: 'Invalid Email',
            type: 'danger'
          }));
          return;
        }
        passwordRecovery();
        break;
      case 2:
        if (recovery.otp.length !== 6) {
          dispatch(showAlert({
            message: "OTP must be of 6 digit number.",
            type: 'danger'
          }));
          return;
        }
        passwordRecoveryVerification();
        break;
      case 3:
        if (!Validator.isPassword(recovery.password)) {
          dispatch(showAlert({
            message: "Password must contains atleast one number and one character.",
            type: 'danger'
          }));
          return;
        }
        if (!(recovery.password.length >= 8 && recovery.password.length <= 32)) {
          dispatch(showAlert({
            message: "Password must be of 8 to 32 character.",
            type: 'danger'
          }));
          return;
        }
        if (recovery.password !== recovery.re_password) {
          dispatch(showAlert({
            message: "Password dosen't matched",
            type: 'danger'
          }));
          return;
        }
        passwordRecoveryNewPassword();
        break;
      default:
        setRecoveryStep(4);
        break;
    }
  }

  const passwordRecovery = () => {
    recoveryController.passwordRecovery(recovery.email).then(response => {
      if (response.success()) {
        setRecoveryStep(2);
        OtpTimer(180);
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

  const passwordRecoveryVerification = () => {
    recoveryController.passwordRecoveryVerification(recovery.otp).then(response => {
      if (response.success()) {
        setRecoveryStep(3);
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

  const passwordRecoveryNewPassword = () => {
    recoveryController.passwordRecoveryNewPassword(recovery.password).then(response => {
      if (response.success()) {
        dispatch(showAlert({
          message: 'Password changed successfully.',
          type: 'success'
        }));
        toLogin();
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
  
  const resentPasswordRecoveryOtp = () => {
    if (resentOtpBtn.disabled) return;

    recoveryController.resentPasswordRecoveryVerificationOtp().then(response => {
      if (response.success()) {
        OtpTimer(180);
        dispatch(showAlert({
          message: `OTP sent to your email ${recovery.email}`,
          type: 'success'
        }));
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

  const OtpTimer = (timeRemaining: number) => {
    setResentOtpBtn({ text: '03:00', disabled: true });
    const timer = setInterval(() => {
      timeRemaining--;
      let min = Math.floor(timeRemaining / 60);
      let sec = timeRemaining % 60;

      setResentOtpBtn({ text: `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`, disabled: true });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setResentOtpBtn({ text: 'Resent OTP', disabled: false });
    }, 150000);
  }

  return (
    <>
      {
        recoveryStep === 1 &&
        <div className="auth-form">
          <h1 className='heading'>Recovery</h1>
          <span className='auth-input auth-instruction'>Enter the Registered Email</span>
          <input type="email" name="email" id="email" className='input-text auth-input' placeholder='Your Email' value={recovery.email} onChange={onRecoveryChange} />
          <TextButton className='login-btn' label='I forget my password' onClick={changeFormAccordingly}/>
          <LinkButton className='login-btn' label="Back" onClick={toLogin} />
        </div>
      }
      {
        recoveryStep === 2 &&
        <div className="auth-form">
          <h1 className='heading'>Recovery</h1>
          <span className='auth-input auth-instruction'>Enter the otp sent to your email {recovery.email}</span>
          <input type="password" name="otp" id="otp" className='input-text auth-input' placeholder='OTP' value={recovery.otp} onChange={onRecoveryChange} />
          <LinkButton className='resent-otp-btn' label={resentOtpBtn.text} onClick={resentPasswordRecoveryOtp} />
          <TextButton className='login-btn' label='Verify' onClick={changeFormAccordingly} />
        </div>
      }
      {
        recoveryStep === 3 &&
        <div className="auth-form">
          <h1 className='heading'>Recovery</h1>
          <span className='auth-input auth-instruction'>Create your new password</span>
          <input type="password" name="password" id="password" className='input-text auth-input' placeholder='Your New Password' value={recovery.password} onChange={onRecoveryChange} />
          <input type="password" name="re_password" id="re_password" className='input-text auth-input' placeholder='Confirm Password' value={recovery.re_password} onChange={onRecoveryChange} />
          <TextButton className='login-btn' label='Recover Now' onClick={changeFormAccordingly} />
        </div>
      }
      {
        recoveryStep === 4 &&
        <div className="auth-form">
          <h1 className='heading'>Recovery</h1>
          <span className='auth-input auth-instruction'>Something went wrong. Try Again</span>
          <LinkButton className='login-btn' label="Retry" onClick={onBack} />
        </div>
      }
    </>
  )
}
