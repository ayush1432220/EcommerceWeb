"use client";
export default function Toast({ toast }){
  return (
    <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
      <span className="toast-icon" id="toastIcon">{toast.icon}</span>
      <span id="toastMsg">{toast.msg}</span>
    </div>
  );
}
