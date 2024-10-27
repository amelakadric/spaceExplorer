import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/news-feed`);
        console.log(response.data);
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch news.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Space News</h1>
      {loading && <p>Loading news...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {!loading &&
          news.length > 0 &&
          news.map((article, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">{article.content}</p>
                  <a href={article.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </div>
                <div className="card-footer">
                  <small className="text-muted">Published on: {new Date(article.pubDate).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!loading && news.length === 0 && <p>No news available at the moment.</p>}
    </div>
  );
};

export default NewsPage;
