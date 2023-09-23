import React from 'react';

interface Props {
  label?: string;
  sizeDistance?: number;
}

export default function Divider({ label = '', sizeDistance = 0 }: Props) {
  return (
    <div className='divider-container'>
      <div className="divider" style={{width: `calc(100% - ${sizeDistance}px)`}}></div>
      <span>{label}</span>
    </div>
  )
}
