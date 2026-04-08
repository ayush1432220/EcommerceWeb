"use client";
import { useState } from 'react';
import { register as registerApi } from '../lib/api';

export default function Register({ setUser, setPage, showToast, active }){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const [confirmPass,setConfirmPass] = useState('');
  const [error,setError] = useState('');

  async function submit(e){
    e.preventDefault();
    setError('');

    if (pass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await registerApi({ name, email, password: pass });
      showToast('✅', 'Account created! Please verify your email.');
      setPage('login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <section className={"page " + (active? 'active':'')} id="page-register">
      <div style={{maxWidth:480,margin:'40px auto',padding:24, borderRadius:12, background:'var(--bg)', boxShadow:'var(--shadow-out)'}}>
        <h2 style={{marginBottom:12}}>Create Account</h2>
        <form onSubmit={submit}>
          <label style={{display:'block',marginBottom:8,fontSize:13,color:'var(--text-muted)'}}>Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%',padding:10,borderRadius:8,marginBottom:12}} placeholder="John Doe" />
          <label style={{display:'block',marginBottom:8,fontSize:13,color:'var(--text-muted)'}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{width:'100%',padding:10,borderRadius:8,marginBottom:12}} />
          <label style={{display:'block',marginBottom:8,fontSize:13,color:'var(--text-muted)'}}>Password</label>
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" required style={{width:'100%',padding:10,borderRadius:8,marginBottom:12}} />
          <label style={{display:'block',marginBottom:8,fontSize:13,color:'var(--text-muted)'}}>Confirm Password</label>
          <input value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} type="password" required style={{width:'100%',padding:10,borderRadius:8,marginBottom:16}} />
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <button className="btn btn-primary" type="submit">Sign Up</button>
            <button type="button" className="btn btn-ghost" onClick={()=>setPage('home')}>Cancel</button>
          </div>
          {error ? <div style={{color:'#dc3545',fontSize:13,marginTop:4}}>{error}</div> : null}
          <div style={{fontSize:13,color:'var(--text-muted)',textAlign:'center',marginTop:12}}>
            Already have an account? <button type="button" style={{background:'none',border:'none',color:'var(--primary)',cursor:'pointer',textDecoration:'underline'}} onClick={()=>setPage('login')}>Sign In</button>
          </div>
        </form>
      </div>
    </section>
  );
}
