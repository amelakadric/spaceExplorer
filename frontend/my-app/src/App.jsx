import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import DailySpacePicturePage from "./pages/DailySpacePicturePage";
import ForumPage from "./pages/ForumPage";
import GuestHomePage from "./pages/GuestHomePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import PlanetPositionPage from "./pages/PlanetPositionPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<GuestHomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/daily-space-picture" element={<DailySpacePicturePage />} />
          {isLoggedIn && (
            <>
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/planet-position" element={<PlanetPositionPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
