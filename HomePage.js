import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Navigate to other pages if needed


const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homePage">
      <div className="homePage__content">
        <h1>Welcome to Instagram</h1>
        <p>
          Share your moments, connect with friends, and discover the world around you!
        </p>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/feed')} // Redirect to the feed page
        >
          Go to Feed
        </Button>
      </div>

      <div className="homePage__image">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
          className="homePage__logo"
        />
      </div>
    </div>
  );
};

export default HomePage;
