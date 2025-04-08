import React, { useState } from "react";
import "./People.css";

function People() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const profileImageUrl = "https://i.pinimg.com/736x/23/ee/9e/23ee9e9d176a1002d7e4efc91311c8dc.jpg";
  const highlights = [
    { title: "buddies 💗", imageUrl: "https://publish.illinois.edu/illinoiscvmf/files/2018/01/jumping-friends-1038x576.jpg" },
    { title: "ooty", imageUrl: "https://www.tamilnadutourism.tn.gov.in/img/pages/medium-desktop/ooty-1655457424_bca80f81e8391ebdaaca.webp" },
    { title: "💛", imageUrl: "https://www.boundless.org/wp-content/uploads/2016/02/girls-need-girls-656a482eb72b6.webp" },
    { title: "bday 🎂", imageUrl: "https://www.shutterstock.com/image-photo/colorful-celebration-birthday-cake-candles-600nw-2408838203.jpg" },
  ];

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleMenuClick = (option) => {
    alert(`You selected: ${option}`);
    setIsSettingsOpen(false);
  };

  return (
    <div className="people">
      <div className="people__header">
        <div className="people__profileContainer">
          <div className="people__profileImageContainer">
            <img src={profileImageUrl} alt="Profile" className="people__profileImage" />
            <div className="people__profileAddIcon">+</div>
          </div>
          <div className="people__profileInfo">
            <h2 className="people__username">varun kumar</h2>
          </div>
        </div>
        <div className="people__settingsContainer">
          <button className="people__settingsIcon" onClick={handleSettingsToggle}>
            ⚙️
          </button>
          {isSettingsOpen && (
            <div className="settingsMenu">
              <p onClick={() => handleMenuClick("Account Privacy")}>Account Privacy</p>
              <p onClick={() => handleMenuClick("Comments Enable Option")}>Comments Enable Option</p>
              <p onClick={() => handleMenuClick("Blocked")}>Blocked</p>
              <p onClick={() => handleMenuClick("Help")}>Help</p>
              <p onClick={() => handleMenuClick("About")}>About</p>
              <p onClick={() => handleMenuClick("Activity")}>Activity</p>
              <p onClick={() => handleMenuClick("Restricted")}>Restricted</p>
              <p onClick={() => handleMenuClick("Privacy centre")}>Privacy centre</p>
            </div>
          )}
        </div>
      </div>
      <div className="people__stats">
        <div>
          <h3>0</h3>
          <p>Posts</p>
        </div>
        <div>
          <h3>177</h3>
          <p>Followers</p>
        </div>
        <div>
          <h3>2,096</h3>
          <p>Following</p>
        </div>
      </div>
      <div className="people__buttons">
        <button className="editProfileButton">Edit Profile</button>
        <button className="shareProfileButton">Share Profile</button>
        <button className="addFriendButton">+</button>
      </div>
      <div className="people__highlights">
        {highlights.map((highlight, index) => (
          <div className="highlight" key={index}>
            <img src={highlight.imageUrl} alt={highlight.title} className="highlight__image" />
            <p className="highlight__title">{highlight.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
