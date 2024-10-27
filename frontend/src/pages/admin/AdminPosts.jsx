import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { getPosts } from "../../services/adminService";

import { Spinner } from "../../components/common/Spinner";

import "./AdminPosts.css";

export const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };

    fetchPosts().finally(() => setIsLoading(false));
  }, []);

  const navigateToAdminPost = (postId) => {
    navigate(`/admin/posts/${postId}`);
  };

  return (
    <div className="container mt-4">
      <div className="col-md-12">
        {isLoading ? (
          <Spinner />
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th># of comments</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => {
                return (
                  <tr key={post._id}>
                    <td>{index + 1}</td>
                    <td>{post.title}</td>
                    <td>{post.author?.username}</td>
                    <td>{new Date(post.createdAt).toDateString()}</td>
                    <td>{post.comments?.length}</td>
                    <td
                      style={{
                        backgroundColor: post.status === "In Review" ? "#fff3cd" : "transparent",
                      }}
                    >
                      {post.status}
                    </td>
                    <td>
                      <div className="table-buttons-wrapper">
                        <Button variant="primary" onClick={() => navigateToAdminPost(post._id)}>
                          <FaEdit />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};
