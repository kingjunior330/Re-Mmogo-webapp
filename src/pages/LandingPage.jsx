import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span>🚀 Re-Mmogo</span>
          </div>
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="btn-login">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>From Contributions to <span>Confident Futures</span> with Re-Mmogo</h1>
        <p>Level up your Motshelo today!</p>
        <p>Track monthly contributions, manage loans, and generate reports with dual approval.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="feature-card">
          <h3>👥 Group Management</h3>
          <p>Easily manage your Motshelo group members, roles, and activities in one place.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Financial Reports</h3>
          <p>Generate reports to track contributions, loans, and interest earnings.</p>
        </div>
        <div className="feature-card">
          <h3>💰 Contributions & Loans</h3>
          <p>Track monthly contributions and manage loans with approval workflows.</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 Re-Mmogo. All rights reserved.</p>
        <p>📍 Botswana | 📧 info@remmogo.com</p>
      </footer>
    </div>
  );
};

export default LandingPage;