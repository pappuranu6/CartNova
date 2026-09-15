import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function SocialFollow() {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">

          {/* CONTACT & SOCIAL LINKS */}
          <p className="social_icons text-center">

            <a
              href="tel:+919135597153"
              className="social"
            >
              ☎ +91-9135597153
            </a>

            {" | "}

            <a
              href="mailto:pappuranu6@gmail.com"
              className="social"
            >
              ✉ pappuranu6@gmail.com
            </a>

            {" | "}

            <a
              href="https://www.linkedin.com/in/pappuranu6/"
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>

            {" | "}

            <a
              href="https://github.com/pappuranu6"
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>

            {" | "}

            <a
              href="https://www.instagram.com/chouhan_rana_pappu_dikant/"
              className="social"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </a>

          </p>

        </div>
      </div>
    </div>
  );
}