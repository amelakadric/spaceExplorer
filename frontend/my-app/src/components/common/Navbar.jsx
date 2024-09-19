import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom

const Navbar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to={isLoggedIn ? "/home" : "/"}>
          SpaceExplorer
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Home link changes based on login status */}
            <li className="nav-item">
              <NavLink className="nav-link" to={isLoggedIn ? "/home" : "/"} activeclassname="active">
                Home
              </NavLink>
            </li>

            {/* Always visible links */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/news" activeclassname="active">
                Space News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/daily-space-picture" activeclassname="active">
                Daily Space Picture
              </NavLink>
            </li>

            {!isLoggedIn && (
              <>
                {/* Visible only when not logged in */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" activeclassname="active">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register" activeclassname="active">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                {/* Additional links visible when logged in */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/forum" activeclassname="active">
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/planet-position" activeclassname="active">
                    Planet Position
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" onClick={handleLogout} activeclassname="active">
                    Logout
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
