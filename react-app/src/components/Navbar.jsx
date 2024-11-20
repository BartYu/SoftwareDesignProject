import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const { userRole, logout } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005/notification/notif_events"
        );
        const data = await response.json();
        setNotifications(data);
        setHasNotifications(data.length > 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5005/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="nav d-flex justify-content-center w-100">
            {/* Profile page is unavailable for admins */}
            {userRole === "volunteer" && (
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                  aria-current="page"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </a>
              </li>
            )}
            {/* Management page unavailable for Volunteers */}
            {userRole === "admin" && (
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isActive("/management") ? "active" : ""
                  }`}
                  aria-current="page"
                  onClick={() => navigate("/management")}
                >
                  <span>Event</span>
                  <span>Management</span>
                </a>
              </li>
            )}
            {userRole === "admin" && (
              <li className="nav-item">
                <a
                  className={`nav-link ${isActive("/report") ? "active" : ""}`}
                  aria-current="page"
                  onClick={() => navigate("/report")}
                >
                  <span>Report</span>
                  <span>Generator</span>
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/calendar")}
              >
                Calendar
              </a>
            </li>
            {/* Matching page unavailable for Volunteers */}
            {userRole === "admin" && (
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isActive("/matching") ? "active" : ""
                  }`}
                  aria-current="page"
                  onClick={() => navigate("/matching")}
                >
                  <span>Volunteer</span>
                  <span>Matching</span>
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/history") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/history")}
              >
                <span>Event</span>
                <span>History</span>
              </a>
            </li>
          </ul>
          {/* Notification icon function */}
          <div className="dropdown ms-auto">
            <button
              className="btn btn-secondary dropdown-toggle btn-invisible"
              type="button"
              id="notification"
              onClick={toggleDropdown}
            >
              <i className="bi bi-bell"></i>
            </button>
            {/* Notification dot */}
            <div
              className={`notification-dot ${hasNotifications ? "show" : ""}`}
            ></div>
            {/* Notification dropdown */}
            {showDropdown && (
              <ul className="dropdown-menu dropdown-menu-end show">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <span className="dropdown-item">
                      {notification.title} - {notification.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* User icon dropdown */}
          <div className="dropdown ms-auto hover-dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="userdropdown"
            >
              <i className="bi bi-person-circle"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="userdropdown"
            >
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-left"></i> Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
