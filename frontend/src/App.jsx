import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AdminNavbar } from "./components/common/AdminNavbar";
import Navbar from "./components/common/Navbar";
import { AdminPost } from "./pages/admin/AdminPost";
import { AdminPosts } from "./pages/admin/AdminPosts";
import DailySpacePicturePage from "./pages/DailySpacePicturePage";
import ForumPage from "./pages/ForumPage";
import GuestHomePage from "./pages/GuestHomePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import PlanetPositionPage from "./pages/PlanetPositionPage";
import { PostPage } from "./pages/PostPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = localStorage.getItem("user");
    return !!user;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const user = localStorage.getItem("user");
    try {
      const userObject = user ? JSON.parse(user) : null;
      return userObject?.role === "Admin";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    try {
      const userObject = user ? JSON.parse(user) : null;
      setIsAdmin(userObject?.role === "Admin");
      setIsLoggedIn(!!userObject);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setIsLoggedIn(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    const user = localStorage.getItem("user");
    try {
      const userObject = user ? JSON.parse(user) : null;
      setIsAdmin(userObject?.role === "Admin");
      setIsLoggedIn(!!userObject);
    } catch (error) {
      console.error("Error parsing user data during login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        {isAdmin ? (
          <AdminNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        ) : (
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        )}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<GuestHomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/daily-space-picture" element={<DailySpacePicturePage />} />

          {/* Protected Routes */}
          {isLoggedIn && (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/planet-position" element={<PlanetPositionPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/post/:postId" element={<PostPage />} />
            </>
          )}

          {/* Admin Routes */}
          {isAdmin && (
            <>
              <Route path="/admin/posts" element={<AdminPosts />} />
              <Route path="/admin/posts/:postId" element={<AdminPost />} />
            </>
          )}

          <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" replace />} />
          <Route path="/admin" element={isAdmin ? <Navigate to="/admin/posts" /> : <Navigate to="/" />} />

          <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
