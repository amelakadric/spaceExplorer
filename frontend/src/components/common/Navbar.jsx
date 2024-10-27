import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { httpService } from "../../services/httpService";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?.id;
        if (userId) {
          const response = await httpService.get(`users/${userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

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
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                to={isLoggedIn ? "/home" : "/"}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/news">
                Space News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                to="/daily-space-picture"
              >
                Daily Space Picture
              </NavLink>
            </li>

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/forum">
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    to="/planet-position"
                  >
                    Planet Position
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    to="/"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/profile">
                    {user && (
                      <img
                        src={`http://localhost:3000/uploads/${user.profilePicture}`}
                        alt="User Avatar"
                        className="rounded-circle "
                        width="30"
                        height="30"
                      />
                    )}
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
