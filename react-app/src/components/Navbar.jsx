import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notifications } from "./notif-data";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const hasNotifications = notifications.length > 0;
  const { userRole } = useAuth();

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
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
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/profile")}
              >
                Profile
              </a>
            </li>
            {/* Management page unavailable for Volunteers */}
            {userRole !== "volunteer" && (
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
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/calendar")}
              >
                Calendar
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/matching") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/matching")}
              >
                <span>Volunteer</span>
                <span>Matching</span>
              </a>
            </li>
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
                    <a className="dropdown-item" href="#">
                      {notification.title}
                    </a>
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
