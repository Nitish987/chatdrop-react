import React from 'react';
import Spinner from 'react-spinkit';

export default function Loading() {
  return (
    <div className='loading'>
      <Spinner name="wave" color="#2195F2" />
    </div>
  )
}
