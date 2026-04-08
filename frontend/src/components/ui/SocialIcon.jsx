"use client";
import React from 'react';

const icons = {
  twitter: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.92c-.62.28-1.28.47-1.98.56.71-.42 1.25-1.08 1.5-1.86-.66.39-1.4.67-2.18.82A3.46 3.46 0 0016.5 4c-1.94 0-3.5 1.58-3.5 3.52 0 .28.03.55.09.81-2.91-.15-5.49-1.54-7.22-3.66-.3.52-.47 1.12-.47 1.76 0 1.21.62 2.28 1.56 2.9-.58-.02-1.12-.18-1.6-.44v.04c0 1.7 1.22 3.12 2.85 3.44-.3.08-.61.12-.94.12-.23 0-.46-.02-.68-.07.46 1.4 1.8 2.42 3.39 2.45A6.93 6.93 0 013 19.54a9.76 9.76 0 005.29 1.55c6.35 0 9.83-5.25 9.83-9.8v-.45c.7-.5 1.3-1.13 1.78-1.85-.64.29-1.33.5-2.05.59z" fill="#2E2E2E"/></svg>),
  facebook: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3h3V0h-3c-3.3 0-6 2.7-6 6v3H4v4h3v8h4v-8h3.3l.7-4H11V6c0-.6.4-1 1-1z" fill="#2E2E2E"/></svg>),
  instagram: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="#2E2E2E"/></svg>)
};

export default function SocialIcon({ kind='twitter', href='#' }){
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-3 rounded-xl transition-transform" aria-label={kind}>
      {icons[kind] || icons.twitter}
    </a>
  );
}
