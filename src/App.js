import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import { FiHome, FiMessageSquare, FiSettings, FiInfo, FiUser, FiMenu, FiX } from 'react-icons/fi';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    console.log(`Navigating to ${section}`);
    // Add your navigation logic here
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </div>
          <h1 className="logo">Gemini<span>AI</span></h1>
          <nav className="main-nav">
            <button 
              className={`nav-button ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => handleNavClick('account')}
              aria-label="Account"
            >
              <FiUser className="nav-icon" /> <span className="nav-text">Account</span>
            </button>
            <button 
              className={`nav-button ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavClick('settings')}
              aria-label="Settings"
            >
              <FiSettings className="nav-icon" /> <span className="nav-text">Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <nav className="side-nav">
            <button 
              className={`side-nav-button ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
              aria-label="Home"
            >
              <FiHome className="nav-icon" /> <span className="nav-text">Home</span>
            </button>
            <button 
              className={`side-nav-button ${activeSection === 'chats' ? 'active' : ''}`}
              onClick={() => handleNavClick('chats')}
              aria-label="Chats"
            >
              <FiMessageSquare className="nav-icon" /> <span className="nav-text">Chats</span>
            </button>
            <button 
              className={`side-nav-button ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => handleNavClick('about')}
              aria-label="About"
            >
              <FiInfo className="nav-icon" /> <span className="nav-text">About</span>
            </button>
          </nav>
        </div>
        
        <div className="content-area">
          <Chatbot />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Gemini AI Assistant. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/contact" className="footer-link">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;