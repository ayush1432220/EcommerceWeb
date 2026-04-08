"use client";
import React from 'react';

export default function NeumorphicButton({ children, onClick, className = '', type = 'button' }){
  function handleDown(e){ e.currentTarget.classList.add('pressed'); }
  function handleUp(e){ e.currentTarget.classList.remove('pressed'); }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} transition-transform duration-150 focus:outline-none`}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
    >
      {children}
    </button>
  );
}
