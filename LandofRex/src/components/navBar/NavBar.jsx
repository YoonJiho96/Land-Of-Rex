import React from 'react';
import './Navbar.css';

const Navbar = ({ activeSection, scrollToSection, sections }) => {
  return (
    <nav className="navbar">
      <div className="logo">E102</div>
      <ul className="nav-links">
        {sections.map((section) => (
          <li
            key={section.name}
            onClick={() => scrollToSection(section.ref)}
            className={activeSection === section.name ? 'active' : ''}
          >
            {section.label}
          </li>
        ))}
      </ul>
      <div className="language-options">
        <span>런처 다운로드</span>
      </div>
    </nav>
  );
};

export default Navbar;
