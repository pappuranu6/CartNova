import React from 'react'
import SocialFollow from './SocialLink'

const Footer = () => {
  return (
    <footer className='cartnova-footer'>

      {/* ================= FOOTER MAIN ================= */}

      <div className='cartnova-footer-inner'>

        {/* BRAND */}

        <div className='cartnova-footer-brand'>

          <div className='cartnova-footer-logo'>
            <i className='fas fa-shopping-bag'></i>
          </div>

          <div className='cartnova-footer-brand-content'>
            <h3>CartNova</h3>

            <p>
              Your trusted destination for
              quality products and easy shopping.
            </p>
          </div>

        </div>

        {/* SOCIAL */}

        <div className='cartnova-footer-social'>

          <span className='cartnova-footer-follow-title'>
            FOLLOW US
          </span>

          <div className='cartnova-footer-social-links'>
            <SocialFollow />
          </div>

        </div>

      </div>

      {/* ================= FOOTER BOTTOM ================= */}

      <div className='cartnova-footer-bottom'>

        <p className='cartnova-footer-copyright'>
          © {new Date().getFullYear()} CartNova.
          All rights reserved.
        </p>

        <div className='cartnova-footer-bottom-links'>

          <span>
            <i className='fas fa-shield-alt'></i>
            Secure Shopping
          </span>

          <span>
            <i className='fas fa-lock'></i>
            Safe &amp; Trusted
          </span>

        </div>
pp
      </div>

    </footer>
  )
}

export default Footer