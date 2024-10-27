import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Modal } from "react-bootstrap";

const API_URL = "http://localhost:3000";

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/forum/posts`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);
    if (file) {
      formData.append("image", file);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/forum/create-post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message) {
        setAlertMessage("Your post has been submitted and is awaiting approval.");
      } else {
        const createdPost = response.data;
        const updatedResponse = await axios.get(`${API_URL}/forum/posts/${createdPost._id}`);
        const updatedPost = updatedResponse.data;

        setPosts([updatedPost, ...posts]);
      }

      setNewPost({ title: "", content: "" });
      setFile(null);
      setShowModal(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    console.log(postId);
    const commentText = commentTexts[postId];
    if (!commentText) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/forum/comment/${postId}`,
        {
          content: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return { ...post, comments: [...response.data.comments] };
        }
        return post;
      });
      setPosts(updatedPosts);
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (e, postId) => {
    setCommentTexts({ ...commentTexts, [postId]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-center">Forum</h2>
        <hr />
        <Button variant="primary" onClick={() => setShowModal(true)} style={{ width: " 40%" }}>
          Add New Post
        </Button>
      </div>

      {alertMessage && (
        <Alert variant="info" onClose={() => setAlertMessage(null)} dismissible className="text-center">
          {alertMessage}
        </Alert>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handlePostSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create a New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Post Title</Form.Label>
              <Form.Control type="text" name="title" value={newPost.title} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Post Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={3}
                value={newPost.content}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Upload an Image (optional)</Form.Label>
              <Form.Control type="file" name="image" onChange={handleFileChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="ms-2">
              Post
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className="container center">
        {posts.map((post) => (
          <div className="row" key={post._id}>
            <div className="col-sm-3"></div>

            <Card className="col-sm-6 mb-4 shadow-sm ">
              <Card.Body>
                <div className=" d-flex align-items-center mb-3">
                  <img
                    src={`${API_URL}/uploads/${post.author.profilePicture}`}
                    alt="User Avatar"
                    className="rounded-circle me-2"
                    width="50"
                    height="50"
                  />
                  <div>
                    <h5 className="mb-0">{post.author?.username || "Unknown User"}</h5>
                    <small className="text-muted">Posted on {new Date(post.createdAt).toLocaleString()}</small>
                  </div>
                </div>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                {post.imagePath && (
                  <img src={`${API_URL}/uploads/${post.imagePath}`} alt="Post visual" className="img-fluid mb-3" />
                )}

                <div className="mt-4">
                  <h6>Comments</h6>
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="d-flex mb-3">
                      <img
                        src={`${API_URL}/uploads/${comment.userId.profilePicture}`}
                        alt="User Avatar"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div className="bg-light p-2 rounded">
                        <p className="mb-1">{comment.content}</p>
                        <small className="text-muted">by {comment.userId?.username || "Unknown User"}</small>
                      </div>
                    </div>
                  ))}

                  <Form
                    className="d-flex mt-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentSubmit(post._id);
                    }}
                    style={{ gap: "0.5rem", alignItems: "flex-start" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Add a comment"
                      value={commentTexts[post._id] || ""}
                      onChange={(e) => handleCommentChange(e, post._id)}
                      required
                      style={{ flexBasis: "60%" }}
                    />
                    <Button variant="outline-secondary" type="submit" style={{ flexBasis: "10%" }}>
                      Comment
                    </Button>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
