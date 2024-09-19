import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Fetch all posts when the component loads
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/forum/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle form input for post creation
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
      const response = await axios.post("/forum/create-post", formData);
      setPosts([response.data, ...posts]); // Add new post to the list
      setNewPost({ title: "", content: "" });
      setFile(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId, commentText) => {
    try {
      const response = await axios.post(`/forum/comment/${postId}`, {
        content: commentText,
      });
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          post.comments.push(response.data); // Add new comment to the post
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Create New Post Section */}
      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <h2>Create a New Post</h2>
          <form onSubmit={handlePostSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={newPost.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Post Content
              </label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                rows="3"
                value={newPost.content}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Upload an Image (optional)
              </label>
              <input type="file" id="image" name="image" className="form-control" onChange={handleFileChange} />
            </div>
            <button type="submit" className="btn btn-primary">
              Post
            </button>
          </form>
        </div>
      </div>

      {/* Posts Section */}
      <h2>All Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            {post.imagePath && <img src={`/uploads/${post.imagePath}`} alt="Post visual" className="img-fluid mb-3" />}

            {/* Display existing comments */}
            <div>
              <h5>Comments</h5>
              {post.comments.map((comment) => (
                <div key={comment.id} className="mb-2">
                  <p>{comment.content}</p>
                  <small>by {comment.user}</small>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const commentText = e.target.elements.comment.value;
                handleCommentSubmit(post.id, commentText);
                e.target.reset(); // Clear the comment input
              }}
            >
              <div className="input-group mt-3">
                <input type="text" className="form-control" placeholder="Add a comment" name="comment" required />
                <button type="submit" className="btn btn-outline-secondary">
                  Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPage;
