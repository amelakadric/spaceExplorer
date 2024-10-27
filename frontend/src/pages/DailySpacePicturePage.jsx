import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const DailySpacePicturePage = () => {
  const [apodData, setApodData] = useState(null);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchApodData = async (date) => {
    try {
      const response = await axios.get(`${API_URL}/apod`, {
        params: { date: date },
      });
      setApodData(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch the picture. Please try again later.");
      setApodData(null);
    }
  };

  useEffect(() => {
    // Fetch today's APOD on initial load
    fetchApodData(new Date().toISOString().split("T")[0]);
  }, []);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    fetchApodData(date);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Daily Space Picture</h1>
      <p className="text-center">Explore today's featured space picture from NASA.</p>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split("T")[0]} // Restrict future dates
          style={{ width: "30%" }}
        />
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {apodData && (
        <div className="card mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="row no-gutters">
            {apodData.media_type === "image" ? (
              <div className="col-md-6">
                <img src={apodData.url} className="card-img" alt={apodData.title} />
                {apodData.hdurl && (
                  <div className="d-flex justify-content-center my-3">
                    <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      View in HD
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-md-6 d-flex align-items-center justify-content-center">
                <p className="text-center">Today's APOD is not an image.</p>
              </div>
            )}

            <div className="col-md-6">
              <div className="card-body">
                <h5 className="card-title">{apodData.title}</h5>
                <p className="card-text">{apodData.explanation}</p>
                <p className="card-text mt-3">
                  <small className="text-muted">Date: {apodData.date}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySpacePicturePage;
