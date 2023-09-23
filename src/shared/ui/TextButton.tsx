import React from 'react';

interface Props {
  className?: string;
  label: string;
  showBorder?: boolean;
  justifyContent?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function TextButton({ className = '', label, showBorder = true, justifyContent="center", onClick }: Props) {
  return (
    <button className={`text-btn ${showBorder ? '' : 'unborder-btn-theme'} ${className}`} onClick={onClick} style={{justifyContent:justifyContent}}>
      <span>{label}</span>
    </button>
  )
}