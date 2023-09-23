import React from 'react';
import '../styles/ReelPlaceholder.css';

interface ReelPlaceholderProps {
  index: number;
  thumbnail: string;
  name: string;
  views: number;
}

export default function ReelPlaceholder({ index, thumbnail, name, views = 0}: ReelPlaceholderProps) {
  return (
    <div className='reel-placeholder'>
      <img className='reel-thumbnail' src={thumbnail} alt="thumbnail" />
      <div className='reel-name-views'>
        <span>{name}</span>
        <span>{views} views</span>
      </div>
    </div>
  )
}
