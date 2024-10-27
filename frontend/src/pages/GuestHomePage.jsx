import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const GuestHomePage = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="jumbotron p-5 shadow-lg rounded">
            <h1 className="display-4">Welcome to SpaceExplorer</h1>
            <p className="lead mt-3">
              You're currently browsing as a guest. Dive into the wonders of space and explore the vast cosmos with our
              curated content, daily space pictures, and the latest news in space exploration!
            </p>
            <hr className="my-4" />
            <p>
              Want to participate in discussions, track celestial events, or explore more in-depth features? Create an
              account or log in to unlock more!
            </p>
            <div className="text-center">
              <a className="btn btn-primary btn-lg mr-4" href="/register" role="button" style={{ marginRight: "10px" }}>
                Register Now
              </a>
              <a className="btn btn-secondary btn-lg" href="/login" role="button">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHomePage;
