import React, { useState } from "react";
import { Button, Modal, Box, TextField } from "@mui/material"; // MUI imports
import { auth } from "./firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false); // State for Sign In modal
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Handle the sign-up process
  const handleSignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .then(() => {
        setOpen(false); // Close the modal
        navigate("/post"); // Redirect to Post.js
      })
      .catch((error) => alert(error.message));
  };

  // Handle the sign-in process
  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpenSignIn(false); // Close the sign-in modal
        navigate("/post"); // Redirect to Post.js after successful sign-in
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            alert("Invalid email address.");
            break;
          case 'auth/wrong-password':
            alert("Incorrect password.");
            break;
          case 'auth/user-not-found':
            alert("No user found with this email.");
            break;
          default:
            alert(error.message); // Show generic error message
        }
      });
  };

  return (
    <div className="header">
      <img
        className="header__image"
        src="https://t4.ftcdn.net/jpg/07/33/91/73/360_F_733917372_WX8Yvk6XkfEX9eznFpLxqwttC6d3glR4.jpg"
        alt="Instagram"
      />
      <div className="header__buttons">
        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={() => setOpen(true)}>Sign Up</Button>
      </div>

      {/* Modal for Sign-Up */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="modal__box">
          <form className="signup__form" onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal for Sign-In */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box className="modal__box">
          <form className="signin__form" onSubmit={handleSignIn}>
            <h2>Sign In</h2>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Header;

