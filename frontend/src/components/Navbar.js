import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Nav(props) {
  const [contactDropdown, toggleContactDropdown] = useState(false)
  return (
    <nav id="navbar">
      <Link to="/">HOME LIGHTBULB BRIGHTER PLANNING</Link>
      <button type="button" 
        onClick={() => toggleContactDropdown(true)} 
        onBlur={() => toggleContactDropdown(false)}
      >Contact Us</button>
      { contactDropdown ? 
        <div>
          <p>Keely Lee</p>
          <p>keely_lee@outlook.com</p>
          <a href="https://www.linkedin.com/in/keely-lee1/" className="linkedin" ><i className="fab fa-linkedin"></i></a>
          <a href="https://github.com/keely-lee" className="github" ><i className="fab fa-github"></i></a>
          <a href="https://angel.co/u/keely-lee" className="angellist" ><i className="fab fa-angellist"></i></a>
          <a href="https://keely-lee.github.io/" className="personal" ><i className="fas fa-user-circle"></i></a>
        </div>
      : null }
    </nav>
  )
}

export default Nav;