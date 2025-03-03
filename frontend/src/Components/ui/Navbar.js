import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle resize to detect mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, isMobile]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen, isMobile]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolling ? "navbar-scrolling" : ""}`}>
      <div className="navbar-container">
        <NavLink to={"/"} className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="#ffffff"
              d="M144 16c0-8.8-7.2-16-16-16s-16 7.2-16 16V32H96c-8.8 0-16 7.2-16 16s7.2 16 16 16h16V96H60.2C49.1 96 40 105.1 40 116.2c0 2.5 .5 4.9 1.3 7.3L73.8 208H72c-13.3 0-24 10.7-24 24s10.7 24 24 24h4L60 384H196L180 256h4c13.3 0 24-10.7 24-24s-10.7-24-24-24h-1.8l32.5-84.5c.9-2.3 1.3-4.8 1.3-7.3c0-11.2-9.1-20.2-20.2-20.2H144V64h16c8.8 0 16-7.2 16-16s-7.2-16-16-16H144V16zM48 416L4.8 473.6C1.7 477.8 0 482.8 0 488c0 13.3 10.7 24 24 24H232c13.3 0 24-10.7 24-24c0-5.2-1.7-10.2-4.8-14.4L208 416H48zm288 0l-43.2 57.6c-3.1 4.2-4.8 9.2-4.8 14.4c0 13.3 10.7 24 24 24H488c13.3 0 24-10.7 24-24c0-5.2-1.7-10.2-4.8-14.4L464 416H336zM304 208v51.9c0 7.8 2.8 15.3 8 21.1L339.2 312 337 384H462.5l-3.3-72 28.3-30.8c5.4-5.9 8.5-13.6 8.5-21.7V208c0-8.8-7.2-16-16-16H464c-8.8 0-16 7.2-16 16v16H424V208c0-8.8-7.2-16-16-16H392c-8.8 0-16 7.2-16 16v16H352V208c0-8.8-7.2-16-16-16H320c-8.8 0-16 7.2-16 16zm80 96c0-8.8 7.2-16 16-16s16 7.2 16 16v32H384V304z"
            />
          </svg>
          <h1>Chessmate</h1>
        </NavLink>

        <button 
          className="mobile-menu-button" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? "active" : ""}`}>
          {localStorage.getItem("chess-app-token") ? (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/updateProfile" 
                  className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/leaderboard" 
                  className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  Leaderboard
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/history" 
                  className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  History
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/game" 
                  className="navbar-link"
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  Play
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <NavLink 
                  to="/signin" 
                  className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
              </li>
              <li className="navbar-item">
                <NavLink 
                  to="/signup" 
                  className={({isActive}) => isActive ? "navbar-link active" : "navbar-link"}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;