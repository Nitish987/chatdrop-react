import React from 'react';

interface Props {
  className?: string;
  highlight: string;
  label: string;
  showBorder?: boolean;
  justifyContent?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function HighlightButton({ className = '', highlight, label, showBorder = true, justifyContent="center", onClick }: Props) {
  return (
    <button className={`text-btn ${showBorder ? '' : 'unborder-btn-theme'} ${className}`} onClick={onClick} style={{justifyContent:justifyContent}}>
      <span style={{marginRight: '10px'}}><strong>{highlight}</strong></span>
      <span>{label}</span>
    </button >
  )
}