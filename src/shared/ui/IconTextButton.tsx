import React from 'react';

interface Props {
  className?: string;
  icon: string;
  label: string;
  showBorder?: boolean;
  applyIconTheme?: boolean;
  justifyContent?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function IconTextButton({ className = '', icon, label, showBorder = true, applyIconTheme = true, justifyContent="center", onClick }: Props) {
  return (
    <button className={`icon-text-btn ${showBorder ? '' : 'unborder-btn-theme'} ${className}`} onClick={onClick} style={{justifyContent:justifyContent}}>
      <img className={`${applyIconTheme ? 'icon-theme' : ''}`} src={icon} alt={label} /> {label}
    </button>
  )
}