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

          <p className="social_icons text-center">

            {/* PHONE */}
            <a
              href="tel:+919135597153"
              className="social"
            >
              ☎ +91- 9135597153
            </a>

            {" | "}

            {/* EMAIL */}
            <a
              href="mailto:pappuranu6@gmail.com"
              className="social"
            >
              ✉ pappuranu6@gmail.com
            </a>

            {" | "}

            {/* LINKEDIN */}
            <a
              href="https://www.linkedin.com/in/pappuranu6/"
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>

            {" | "}

            {/* GITHUB */}
            <a
              href="https://github.com/pappuranu6"
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>

            {" | "}

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/chouhan_rana_pappu_dikant/"
              className="social"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </a>

          </p>

          <p className="col-sm text-center">

            &copy; {new Date().getFullYear()}{" "}

            <span className="footer_name">
              Made by Pappu Kumar
            </span>

            <br />

            Made with ❤️ and care....

          </p>

        </div>
      </div>
    </div>
  );
}