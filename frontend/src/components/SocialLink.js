import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faGithub,
  faLinkedin,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons'

export default function SocialFollow() {
  return (
    <div className='cartnova-contact-box'>

      {/* CONTACT */}
      <div className='cartnova-contact-row'>

        <a
          href='tel:+919135597153'
          className='social'
        >
          ☎ +91-9135597153
        </a>

        <span>|</span>

        <a
          href='mailto:pappuranu6@gmail.com'
          className='social'
        >
          ✉ pappuranu6@gmail.com
        </a>

      </div>


      {/* SOCIAL LINKS */}
      <div className='cartnova-social-row'>

        <a
          href='https://www.linkedin.com/in/pappuranu6/'
          className='social'
          target='_blank'
          rel='noreferrer'
        >
          <FontAwesomeIcon icon={faLinkedin} />
          LinkedIn
        </a>

        <span>|</span>

        <a
          href='https://github.com/pappuranu6'
          className='social'
          target='_blank'
          rel='noreferrer'
        >
          <FontAwesomeIcon icon={faGithub} />
          GitHub
        </a>

        <span>|</span>

        <a
          href='https://www.instagram.com/chouhan_rana_pappu_dikant/'
          className='social'
          target='_blank'
          rel='noreferrer'
        >
          <FontAwesomeIcon icon={faInstagram} />
          Instagram
        </a>

      </div>

    </div>
  )
}