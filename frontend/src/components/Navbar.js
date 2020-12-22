import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/navbar.css';

function Nav(props) {
  const [contactDropdown, toggleContactDropdown] = useState(false)
  return (
    <nav id="navbar">
      <Link to="/"><i className="far fa-lightbulb"></i>BRIGHTER PLANNING</Link>
      <div className="nav-contact-wrapper">
        <button type="button" 
          className="nav-contact-button"
          onClick={() => toggleContactDropdown(true)} 
          onBlur={() => {
            toggleContactDropdown(false)
          }}
        >Contact Us</button>
        { contactDropdown ? 
          <div className="nav-contact">
            <p>Keely Lee</p>
            <a href="mailto:keely_lee@outlook.com"><i className="fas fa-paper-plane"></i>keely_lee@outlook.com</a>
            <a href="https://www.linkedin.com/in/keely-lee1/" className="linkedin" ><i className="fab fa-linkedin"></i></a>
            <a href="https://github.com/keely-lee" className="github" ><i className="fab fa-github"></i></a>
            <a href="https://angel.co/u/keely-lee" className="angellist" ><i className="fab fa-angellist"></i></a>
            <a href="https://keely-lee.github.io/" className="personal" ><i className="fas fa-user-circle"></i></a>
          </div>
        : null }
      </div>
    </nav>
  )
}

export default Nav;

// CHANGE CONTACT DIV TO A SLIDE FROM RIGHT TO LEFT ON THE NAV. SETSTATE WILL TOGGLE CLASSNAME FOR VISIBILITY