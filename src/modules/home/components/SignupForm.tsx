import React, { useState } from 'react';
import '../styles/AuthForm.css';
import TextButton from '../../../shared/ui/TextButton';
import LinkButton from '../../../shared/ui/LinkButton';
import Links from '../../../settings/constants/links';
import { Validator, range } from '../../../infra/utils';
import { useAppDispatch } from '../../../redux/hooks';
import { showAlert } from '../../../features/alert/alertSlice';
import { setAuthenticated } from '../../../features/auth/authSlice'; 
import SignupFormController from '../controllers/SignupFormController';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: 'gender',
    day: 'day',
    month: 'month',
    year: 'year',
    password: '',
    re_password: '',
  });
  const [otp, setOtp] = useState('')
  const [signupStep, setSignupStep] = useState(1);
  const [resentOtpBtn, setResentOtpBtn] = useState({ text: 'Resent OTP', disabled: true });

  const signupController = new SignupFormController();

  const toLogin = () => navigate('/');

  const onUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const onUserSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const onOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  }

  const onBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    switch (signupStep) {
      case 2:
        setSignupStep(1);
        break;
      case 3:
        setSignupStep(2);
        break;
      default:
        setSignupStep(1);
        break;
    }
  }

  const changeSignupStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    switch (signupStep) {
      case 1:
        if (user.first_name.length < 3) {
          dispatch(showAlert({
            message: 'First name must contains atleast 3 characters.',
            type: 'danger'
          }));
          return;
        }
        if (user.last_name.length < 2) {
          dispatch(showAlert({
            message: 'Last name must contains atleast 2 characters.',
            type: 'danger'
          }));
          return;
        }
        if (!Validator.isEmail(user.email)) {
          dispatch(showAlert({
            message: 'Invalid Email',
            type: 'danger'
          }));
          return;
        }
        if (user.gender === 'gender') {
          dispatch(showAlert({
            message: 'Gender Must be specified',
            type: 'danger'
          }));
          return;
        }
        setSignupStep(2);
        break;
      case 2:
        if (user.day === 'day') {
          dispatch(showAlert({
            message: 'Please select the day of your D.O.B',
            type: 'danger'
          }));
          return;
        }
        if (user.month === 'month') {
          dispatch(showAlert({
            message: 'Please select the month of your D.O.B',
            type: 'danger'
          }));
          return;
        }
        if (user.year === 'year') {
          dispatch(showAlert({
            message: 'Please select the year of your D.O.B',
            type: 'danger'
          }));
          return;
        }
        setSignupStep(3);
        break;
      case 3:
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
        if (user.password !== user.re_password) {
          dispatch(showAlert({
            message: "Password dosen't matched",
            type: 'danger'
          }));
          return;
        }
        signup();
        break;
      case 4:
        if (otp.length !== 6) {
          dispatch(showAlert({
            message: "OTP must be of 6 digit number.",
            type: 'danger'
          }));
          return;
        }
        signupVerification();
        break;
      default:
        setSignupStep(5);
        break;
    }
  }

  const signup = async () => {
    let day = parseInt(user.day) < 10 ? `0${user.day}` : user.day;
    let month = parseInt(user.month) < 10 ? `0${user.month}` : user.month;
    let year = user.year

    signupController.signup({
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      gender: user.gender,
      dob: `${day}-${month}-${year}`,
      password: user.password
    }).then(response => {
      if (response.success()) {
        setSignupStep(4);
        OtpTimer(180);
        setUser({
          first_name: '',
          last_name: '',
          email: '',
          gender: 'gender',
          day: 'day',
          month: 'month',
          year: 'year',
          password: '',
          re_password: '',
        });
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

  const signupVerification = async () => {
    signupController.signupVerification(otp).then(response => {
      if (response.success()) {
        dispatch(showAlert({
          message: "Account Created successfully.",
          type: 'success'
        }));
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

  const resentSignupOtp = async () => {
    if (resentOtpBtn.disabled) return;

    signupController.resentSignupVerificationOtp().then(response => {
      if (response.success()) {
        OtpTimer(180);
        dispatch(showAlert({
          message: `OTP sent to your email ${user.email}`,
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
        signupStep === 1 &&
        <div className="auth-form">
          <h1 className='heading'>Signup</h1>
          <span className='auth-input auth-instruction'>Enter the Details</span>
          <div className="signup-name-container">
            <input type="text" name="first_name" id="first_name" className='input-text' placeholder='First Name' value={user.first_name || ''} onChange={onUserChange} />
            <input type="text" name="last_name" id="last_name" className='input-text' placeholder='Last Name' value={user.last_name || ''} onChange={onUserChange} />
          </div>
          <input type="email" name="email" id="email" className='input-text auth-input' placeholder='Your Email' value={user.email || ''} onChange={onUserChange} />
          <select className='input-text signup-gender' name="gender" id="gender" value={user.gender || ''} onChange={onUserSelectChange}>
            <option value="gender">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Others</option>
          </select>
          <span className='auth-input auth-instruction'>while Signing up, You are accepting the <a href={Links.chatdropTerms} target='_blank' rel='noreferrer'>terms and condition</a> and <a href={Links.chatdropPolicy} target='_blank' rel='noreferrer'>privacy policy</a>.</span>
          <TextButton className='signup-btn' label='Sign up' onClick={changeSignupStep} />
          <LinkButton className='login-btn' label="Already have an account? Login" onClick={toLogin}/>
        </div>
      }
      {
        signupStep === 2 &&
        <div className="auth-form">
          <h1 className='heading'>Signup</h1>
          <span className='auth-input auth-instruction'>Enter you Date of Birth</span>
          <div className="signup-dob-container">
            <select className='input-text' name="day" id="day" value={user.day || 'day'} onChange={onUserSelectChange}>
              <option value="day">Day</option>
              {
                range(1, 31).map(e => {
                  return (
                    <option key={e} value={e}>{e}</option>
                  )
                })
              }
            </select>
            <select className='input-text' name="month" id="month" value={user.month || 'month'} onChange={onUserSelectChange}>
              <option value="month">Month</option>
              {
                ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((e, i) => {
                  return (
                    <option key={e} value={i + 1}>{e}</option>
                  )
                })
              }
            </select>
            <select className='input-text' name="year" id="year" value={user.year || 'year'} onChange={onUserSelectChange}>
              <option value="year">Year</option>
              {
                range(1951, new Date().getFullYear()).reverse().map(e => {
                  return (
                    <option key={e} value={e}>{e}</option>
                  )
                })
              }
            </select>
          </div>
          <span className='auth-input auth-instruction'>while Signing up, You are accepting the <a href={Links.chatdropTerms} target='_blank' rel='noreferrer'>terms and condition</a> and <a href={Links.chatdropPolicy} target='_blank' rel='noreferrer'>privacy policy</a>.</span>
          <TextButton className='signup-btn' label='Next' onClick={changeSignupStep} />
          <LinkButton className='login-btn' label="Back" onClick={onBack}/>
        </div>
      }
      {
        signupStep === 3 &&
        <div className="auth-form">
          <h1 className='heading'>Signup</h1>
          <span className='auth-input auth-instruction'>Create Your Password</span>
          <input type="password" name="password" id="password" className='input-text auth-input' placeholder='Your Password' value={user.password || ''} onChange={onUserChange} />
          <input type="password" name="re_password" id="re_password" className='input-text auth-input' placeholder='Your Confirm Password' value={user.re_password || ''} onChange={onUserChange} />
          <span className='auth-input auth-instruction'>while Signing up, You are accepting the <a href={Links.chatdropTerms} target='_blank' rel='noreferrer'>terms and condition</a> and <a href={Links.chatdropPolicy} target='_blank' rel='noreferrer'>privacy policy</a>.</span>
          <TextButton className='signup-btn' label='Next' onClick={changeSignupStep} />
          <LinkButton className='login-btn' label="Back" onClick={onBack} />
        </div>
      }
      {
        signupStep === 4 &&
        <div className="auth-form">
          <h1 className='heading'>Signup</h1>
          <span className='auth-input auth-instruction'>Enter the otp sent to your email {user.email}</span>
          <input type="password" name="otp" id="otp" className='input-text auth-input' placeholder='OTP' value={otp} onChange={onOtpChange} />
          <LinkButton className='resent-otp-btn' label={resentOtpBtn.text} onClick={resentSignupOtp} />
          <span className='auth-input auth-instruction'>while Signing up, You are accepting the <a href={Links.chatdropTerms} target='_blank' rel='noreferrer'>terms and condition</a> and <a href={Links.chatdropPolicy} target='_blank' rel='noreferrer'>privacy policy</a>.</span>
          <TextButton className='signup-btn' label='Verify and Signup' onClick={changeSignupStep} />
        </div>
      }
      {
        signupStep === 5 &&
        <div className="auth-form">
          <h1 className='heading'>Signup</h1>
          <span className='auth-input auth-instruction'>Something went wrong. Try Again</span>
          <LinkButton className='login-btn' label="Retry" onClick={onBack}/>
        </div>
      }
    </>
  )
}
