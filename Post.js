import React, { useState, useEffect } from "react";
import { db, storage, auth } from "./firebase";
import "./Post.css";
import {
  Button,
  TextField,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  Favorite,
  Home,
  Search,
  Movie,
  Person,
  Bookmark,
  BookmarkBorder,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser ? authUser : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(image.type)) {
      alert("Unsupported file type. Please upload a JPEG or PNG image.");
      return;
    }

    setLoading(true);
    try {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading post:", error);
          alert(`Upload failed: ${error.message}`);
        },
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          await db.collection("posts").add({
            username: user.displayName,
            imageUrl: url,
            caption,
            likes: 0,
            comments: [],
            timestamp: new Date(),
          });

          setCaption("");
          setImage(null);
          setLoading(false);
          alert("Post uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error uploading post:", error);
      setLoading(false);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleAddComment = async (postId) => {
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
  
    try {
      console.log("Sending request to API...");
      
      const response = await fetch("http://127.0.0.1:5002/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
  
      console.log("Response received:", response);
      
      if (!response.ok) {
        throw new Error(`Server error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.prediction === "Non-Offensive") {
        console.log("Adding comment to Firebase...");
        
        const postRef = db.collection("posts").doc(postId);
        const postDoc = await postRef.get();
        const currentComments = postDoc.data().comments || [];
  
        await postRef.update({
          comments: [...currentComments, { user: user.displayName, comment, likes: 0 }],
        });
  
        setComment(""); 
      } else {
        alert("Your comment was flagged as offensive.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to add comment. Check your network or API connection.");
    }
  };
  

  const handleLike = async (postId, currentLikes) => {
    try {
      await db.collection("posts").doc(postId).update({
        likes: currentLikes + 1,
      });
    } catch (error) {
      alert(`Failed to like post: ${error.message}`);
    }
  };

  const handleSavePost = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleFollow = () => setFollowing(!following);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleHomeNavigation = () => navigate("/");

  return (
    <div className={`post ${darkMode ? "dark-mode" : ""}`}>
      <div className="post__upload">
        <h2>Create a Post</h2>
        <TextField
          label="Caption"
          variant="outlined"
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ marginBottom: "10px" }} />
        <Button variant="contained" color="primary" onClick={handleUpload} fullWidth disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      <IconButton className="dark-mode-toggle" onClick={toggleDarkMode} style={{ position: "absolute", top: "10px", right: "10px" }}>
        {darkMode ? "🌙" : "☀️"}
      </IconButton>

      <div className="post__feed">
        {posts.map(({ id, data }) => (
          <div key={id} className="post__card">
            <div className="post__usernameContainer">
              <h4 className="post__username">{data.username}</h4>
              <Button
                variant="contained"
                color={following ? "secondary" : "primary"}
                size="small"
                className="post__followButton"
                onClick={handleFollow}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
            <img className="post__image" src={data.imageUrl} alt="Post" />
            <div className="post__caption">
              <h3>{data.caption}</h3>
            </div>

            <div className="post__actions">
              <IconButton onClick={() => handleLike(id, data.likes)}>
                <Favorite color={data.likes > 0 ? "secondary" : "default"} />
              </IconButton>
              <IconButton onClick={() => handleSavePost(id)}>
                {savedPosts.includes(id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </div>

            <div className="post__comments">
              {data.comments?.map((c, index) => (
                <div key={index} className="post__comment">
                  <p><strong>{c.user}:</strong> {c.comment}</p>
                </div>
              ))}
              <div className="post__commentInput">
                <TextField label="Add a comment" variant="outlined" size="small" value={comment} onChange={(e) => setComment(e.target.value)} fullWidth />
                <Button variant="text" onClick={() => handleAddComment(id)} style={{ marginLeft: "10px" }}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation style={{ position: "fixed", bottom: 0, width: "100%" }}>
        <BottomNavigationAction label="Home" icon={<Home />} onClick={handleHomeNavigation} />
        <BottomNavigationAction label="Search" icon={<Search />} />
        <BottomNavigationAction label="Reels" icon={<Movie />} />
        <BottomNavigationAction label="Profile" icon={<Person />} onClick={() => navigate("/people")} />
      </BottomNavigation>
    </div>
  );
};

export default Post;




