import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/home.css'; // Import the CSS file

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleSignUp = () => {
    navigate('/register'); // Navigate to the sign-up page
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Movie Review App</h1>
      <div className="button-container">
        <button className="button" onClick={handleLogin}>
          Login
        </button>
        <button className="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
