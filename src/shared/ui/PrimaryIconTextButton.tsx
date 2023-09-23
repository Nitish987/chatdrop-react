import React from 'react';

interface Props {
  className?: string;
  icon: string;
  label: string;
  applyIconTheme?: boolean;
  justifyContent?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function PrimaryIconTextButton({ className = '', icon, label, applyIconTheme = true, justifyContent="center", onClick }: Props) {
  return (
    <button className={`primary-icon-text-btn ${className}`} onClick={onClick} style={{justifyContent:justifyContent}}>
      <img className={`${applyIconTheme ? 'icon-alt-theme' : ''}`} src={icon} alt={label} /> {label}
    </button>
  )
}