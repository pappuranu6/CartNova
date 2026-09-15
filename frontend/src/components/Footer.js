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

        {/* ================= DEVELOPER INFO ================= */}

        <div className='cartnova-footer-developer'>

          <img
            src='/images/pappu-profile.jpg'
            alt='Pappu Rana Chauhan'
            className='cartnova-footer-profile'
          />

          <div className='cartnova-footer-developer-info'>
            <h4>Pappu Rana Chauhan</h4>

            <p>Software Engineer</p>
          </div>

        </div>

        {/* ================= SOCIAL ================= */}

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

        {/* MADE BY */}

        <p className='cartnova-footer-made'>
          Made by <strong>Pappu Rana Chauhan</strong> (Software Engineer)
        </p>

      </div>

    </footer>
  )
}

export default Footer