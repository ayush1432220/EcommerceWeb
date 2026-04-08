"use client";
import React, { useState } from 'react';
import NeumorphicInput from './ui/NeumorphicInput';
import NeumorphicButton from './ui/NeumorphicButton';
import SocialIcon from './ui/SocialIcon';
import styles from './FooterNeo.module.css';

export default function FooterNeo(){
  const [email,setEmail] = useState('');

  function subscribe(e){
    e && e.preventDefault();
    // placeholder for subscription; in real app send to API
    try{ localStorage.setItem('newsletter', JSON.stringify({email, date:Date.now()})); }catch(e){}
    setEmail('');
    // small toast could be used; keep simple here
    alert('Subscribed — thank you!');
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top - Newsletter */}
        <div className={styles.newsletter}>
          <h3>Subscribe to our newsletter</h3>
          <p>Get updates on new products, sales and more.</p>
          <form onSubmit={subscribe} className={styles.form}>
            <div style={{flex:1}}>
              <NeumorphicInput className={styles['neu-input']} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" />
            </div>
            <div>
              <NeumorphicButton type="submit" className={styles['neu-button']} onClick={subscribe}>
                <span style={{color:'#fff', background:'linear-gradient(90deg,#6C63FF,#00BFA6)', padding:'8px 14px', borderRadius:12, display:'inline-block'}}>Subscribe</span>
              </NeumorphicButton>
            </div>
          </form>
        </div>

        {/* Main Grid */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.brand}>NeuShop</div>
            <p style={{marginTop:8,color:'#555'}}>Soft, tactile shopping experiences — curated products for modern living.</p>
          </div>

          <div className={`${styles.card} ${styles.links}`}>
            <h4 style={{marginBottom:8,fontWeight:700}}>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className={`${styles.card} ${styles.links}`}>
            <h4 style={{marginBottom:8,fontWeight:700}}>Customer Service</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div className={styles.card}>
            <h4 style={{marginBottom:8,fontWeight:700}}>Contact</h4>
            <div>ayushlap96@gmail.com</div>
            <div style={{marginTop:6}}>+919616250906</div>
            <div style={{marginTop:6}}>Luckow Uttar Prades</div>
          </div>

          <div className={styles.card}>
            <h4 style={{marginBottom:8,fontWeight:700}}>Follow Us</h4>
            <div className={styles.socialRow}>
              <div className={styles.socialIcon}><SocialIcon kind="twitter" href="https://x.com/UrsTechSolution" /></div>
              <div className={styles.socialIcon}><SocialIcon kind="facebook" href="https://www.facebook.com/people/UrsTech-Solution/" /></div>
              <div className={styles.socialIcon}><SocialIcon kind="instagram" href="https://www.instagram.com/urstech_solution/" /></div>
            </div>
            <div style={{marginTop:12}}>
              <span style={{fontSize:13,color:'#555'}}>We accept</span>
              <div className={styles.payments}>
                <div className={styles.payBadge}>VISA</div>
                <div className={styles.payBadge}>Master</div>
                <div className={styles.payBadge}>UPI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <div style={{fontSize:13,color:'#555'}}>© 2026 URS tech solution — All rights reserved.</div>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
