import React, { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { CustomModal } from "../components/common/Modal";

import { useParams } from "react-router-dom";

import { deletePost, getPost } from "../services/adminService";
import { API_URL } from "../services/httpService";

export const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const post = await getPost(postId);
      setPost(post);
    };

    fetchPosts().finally(() => setIsLoading(false));
  }, [postId]);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onDeleteSubmit = async () => {
    await deletePost(post._id);
    navigate("/profile");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <div className="container mt-4 text-center">
        {/* <Alert variant="danger"> */}
        <h4>404 - Not Found</h4>
        <p>This page no longer exists or the post could not be found.</p>
        <Button variant="primary" onClick={() => navigate("/profile")} style={{ width: "40%" }}>
          Go Back to Profile
        </Button>
        {/* </Alert> */}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <CustomModal
        showModal={isModalOpen}
        handleClose={onModalClose}
        handleSubmit={onDeleteSubmit}
        modalHeading="Delete post"
        modalBody="Are you sure you want to delete this post?"
      />
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Post Information</h5>
            </Card.Header>
            <Card.Body>
              {post.imagePath && (
                <Card.Img
                  variant="top"
                  src={`${API_URL}/uploads/${post.imagePath}`}
                  alt="Post image"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    display: "block",
                  }}
                />
              )}
              <Card.Text>
                <strong>Title:</strong> {post.title}
              </Card.Text>
              <Card.Text>
                <strong>Content:</strong> {post.content}
              </Card.Text>
              <Card.Text>
                <strong>Status:</strong> {post.status}
              </Card.Text>
              <Card.Text>
                <strong>Created At:</strong> {new Date(post.createdAt).toLocaleString()}
              </Card.Text>
              <Card.Text>
                <strong>Updated At:</strong> {new Date(post.updatedAt).toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h5>Comments</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {post.comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <strong>Comment:</strong> {comment.content} <br />
                  <strong>By:</strong> {comment.userId.username}
                  <br />
                  <small>Posted on: {new Date(comment.createdAt).toLocaleString()}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Actions</h5>
            </Card.Header>
            <Card.Body>
              <Button
                variant="danger"
                block
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Delete Post
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
