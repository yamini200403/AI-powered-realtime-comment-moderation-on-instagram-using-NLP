import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import People from "./People";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header/>} />
        <Route path="/Post" element={<Post />} />
        <Route path="/people" element={<People />} />
      </Routes>
    </Router>
  );
}

export default App;

