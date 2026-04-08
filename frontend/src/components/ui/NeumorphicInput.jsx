"use client";
import React from 'react';

export default function NeumorphicInput({ value, onChange, placeholder = '', className = '' }){
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type="email"
      className={`${className}`}
      aria-label={placeholder}
    />
  );
}
