import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/userProfile.css";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/users/${parsedUser.id}`);
        setUser(userResponse.data);

        const postsResponse = await axios.get(`http://localhost:3000/forum/posts/user/${parsedUser.id}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Failed to fetch user data or posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditClick = () => {
    setUpdatedUser({
      username: user.username,
      email: user.email,
      profilePicture: null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", updatedUser.username);
      formData.append("email", updatedUser.email);

      if (updatedUser.profilePicture) {
        formData.append("profilePicture", updatedUser.profilePicture);
      }

      const response = await axios.put(`http://localhost:3000/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser((prevUser) => ({
        ...prevUser,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: response.data.profilePicture,
      }));

      setShowModal(false);
    } catch (error) {
      console.error("Failed to update user information:", error);
    }
  };

  const renderPostStatusBox = (status) => {
    switch (status) {
      case "In Review":
        return <div className="status-box review">The post is being reviewed.</div>;
      case "Rejected":
        return <div className="status-box rejected">The post has been rejected.</div>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-container mt-5">
      <div className="user-info">
        <img src={`http://localhost:3000/uploads/${user.profilePicture}`} alt="Profile" className="profile-picture" />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <Button variant="primary" onClick={handleEditClick} style={{ width: "40%" }}>
          Edit
        </Button>
      </div>
      <div className="user-posts mt-2">
        <h3>Your Posts</h3>
        {posts.length === 0 ? (
          <p>You have no posts yet.</p>
        ) : (
          <ul className="posts-list">
            {posts.map((post) => (
              <li key={post.id} className="post-item">
                {renderPostStatusBox(post.status)}
                <h4>
                  <Link to={`/post/${post._id}`}>{post.title}</Link>
                </h4>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={updatedUser.username}
                onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setUpdatedUser({ ...updatedUser, profilePicture: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
