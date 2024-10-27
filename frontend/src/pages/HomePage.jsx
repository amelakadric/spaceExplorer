import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const HomePage = () => {
  return (
    <div className="container mt-5">
      {/* Welcome section */}
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to SpaceExplorer</h1>
        <p className="lead">
          Your gateway to explore the wonders of space, stay updated with space news, view daily space pictures, and
          engage with a community of space enthusiasts.
        </p>
      </div>

      {/* Features Section */}
      <div className="row text-center">
        {/* Feature 1 */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Latest Space News</h5>
              <p className="card-text">
                Stay informed with the most recent discoveries, missions, and developments in space exploration.
              </p>
              <a href="/news" className="btn btn-primary">
                Read Space News
              </a>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Daily Space Picture</h5>
              <p className="card-text">
                Discover breathtaking images of the universe, updated daily from NASA's archives.
              </p>
              <a href="/daily-space-picture" className="btn btn-primary">
                View Picture
              </a>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Join the Forum</h5>
              <p className="card-text">
                Engage in discussions, ask questions, and share your thoughts with a community of space lovers.
              </p>
              <a href="/forum" className="btn btn-primary">
                Visit Forum
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <h2>Start Exploring the Universe Today</h2>
        <p className="lead">Whether you're a beginner or an expert, SpaceExplorer offers something for everyone.</p>
        <a href="/planet-position" className="btn btn-success btn-lg">
          Explore Planet Positions
        </a>
      </div>
    </div>
  );
};

export default HomePage;
