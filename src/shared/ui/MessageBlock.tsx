import React from 'react';

interface Props {
  message: string;
  width?: number;
  height?: number;
  applyBoxShadow?: boolean;
}

/**
 * show error block view with label.
 * optional params
 * width = 100 default value in percent
 * height = 100 default value in px
 */

export default function MessageBlock({ message, width = 100, height = 100, applyBoxShadow = false}: Props) {
  return (
    <div className={`message-block ${applyBoxShadow ? 'box-shadow' : ''}`} style={{width: `${width}%`, height: `${height}px`}}>
      <p>{message}</p>
    </div>
  )
}
