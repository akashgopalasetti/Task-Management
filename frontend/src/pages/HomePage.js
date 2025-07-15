// 📁 frontend/src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-box">
        <h1 className="homepage-title">Task Management System</h1>
        <p className="homepage-subtitle">Organize. Assign. Track your team's productivity with ease.</p>
        <button onClick={() => navigate('/login')} className="homepage-button">
          Start
        </button>
      </div>
    </div>
  );
}
