import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Notifications testing
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleLogout = () => {
    // Perform logout actions before navigating (if needed)
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

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
            <li className="nav-item">
              <a
                className={`nav-link ${
                  isActive("/management") ? "active" : ""
                }`}
                aria-current="page"
                onClick={() => navigate("/management")}
              >
                Management
              </a>
            </li>
            {/* Extra Calendar feature */}
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
                Matching
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${isActive("/history") ? "active" : ""}`}
                aria-current="page"
                onClick={() => navigate("/history")}
              >
                History
              </a>
            </li>
          </ul>
          {/* Notification icon function */}
          <div className="dropdown ms-auto dropdown">
            <button
              className="btn btn-secondary dropdown-toggle btn-invisible"
              type="button"
              id="notification"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-bell"></i>
            </button>
            {/* Notification dot */}
            <div
              className={`notification-dot ${hasNotifications ? "show" : ""}`}
            ></div>
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
                  <i class="bi bi-box-arrow-left"></i> Log Out
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
