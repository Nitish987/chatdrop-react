import '../styles/User.css';
import React from 'react';
import Avatar from '../utils/avatar';
import { useNavigate } from 'react-router-dom';

interface UserProps {
  uid: string;
  name: string;
  photo: string;
  gender: string;
  message: string;
  applyBoxShadow?: boolean;
}

export default function User({ uid, name, photo, gender, message, applyBoxShadow = true }: UserProps) {
  const navigate = useNavigate();

  const toProfile = () => {
    navigate(`/profile/${uid}`);
  }

  return (
    <div className={`user ${applyBoxShadow ? 'box-shadow' : ''}`} onClick={toProfile}>
      <img className='user-avatar' src={Avatar.get(gender, photo)} alt={name} />
      <div className="name-message">
        <span className='user-name'>{name}</span>
        <span className='user-message'>{message}</span>
      </div>
    </div>
  )
}
