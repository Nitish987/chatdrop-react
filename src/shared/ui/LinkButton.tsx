import React from 'react';

interface Props {
  className?: string;
  label: string;
  justifyContent?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function LinkButton({ className = '', label, justifyContent="center", onClick }: Props) {
  return (
    <button className={`link-btn ${className}`} onClick={onClick} style={{justifyContent:justifyContent}}>
      <span>{label}</span>
    </button>
  )
}