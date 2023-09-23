import React from 'react';

interface Props {
  className?: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function DropdownItem({ className = '', label, onClick }: Props) {
  return (
    <button className={`dropdown-item ${className}`} onClick={onClick}>
      {label}
    </button>
  )
}