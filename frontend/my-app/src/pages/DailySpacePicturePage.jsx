import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const DailySpacePicturePage = () => {
  const [apodData, setApodData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApodData = async () => {
      try {
        const response = await axios.get(`${API_URL}/apod`);
        setApodData(response.data);
      } catch (err) {
        setError("Failed to fetch the picture. Please try again later.");
      }
    };
    fetchApodData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Daily Space Picture</h1>
      <p className="text-center">Explore today's featured space picture from NASA.</p>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {apodData && (
        <div className="card mx-auto" style={{ width: "36rem" }}>
          {/* Display APOD image */}
          {apodData.media_type === "image" ? (
            <img src={apodData.url} className="card-img-top" alt={apodData.title} />
          ) : (
            <p className="text-center">Today's APOD is not an image.</p>
          )}

          {/* Card content */}
          <div className="card-body">
            <h5 className="card-title">{apodData.title}</h5>
            <p className="card-text">{apodData.explanation}</p>
            <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View in HD
            </a>
            <p className="card-text mt-3">
              <small className="text-muted">Date: {apodData.date}</small>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySpacePicturePage;
