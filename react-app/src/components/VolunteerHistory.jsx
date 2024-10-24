import "./VolunteerHistory.css"; // Import your CSS file
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "./NavBar"; // Import the NavBar component
import { format } from 'date-fns'; // Import date-fns for date formatting

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]); // State to hold volunteer history
  const [error, setError] = useState(""); // State to hold any errors
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch volunteer history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5005/volunteer-history", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        setHistory(data); // Update state with fetched data
      } catch (err) {
        setError(err.message); // Set error message in state
        console.error(err); // Log error for debugging
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchHistory(); // Call fetch function
  }, []); // Empty dependency array to run effect once

  return (
    <div>
      <NavBar /> {/* Navigation bar component */}
      <div className="volunteer-history-container">
        <Helmet>
          <title>Volunteer History</title>
        </Helmet>
        <h3>Your Volunteer History</h3>
        {loading && <div className="spinner">Loading...</div>} {/* Loading state */}
        {error && <div className="error">{error}</div>} {/* Error message */}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Skills Required</th>
                <th>Urgency</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((event, index) => (
                <tr key={index}>
                  <td>{event.eventName}</td>
                  <td>{event.eventDescription}</td>
                  <td>{event.location}</td>
                  <td>{event.requiredSkills}</td>
                  <td>{event.urgency}</td>
                  <td>{format(new Date(event.eventDate), 'MMMM dd, yyyy')}</td> {/* Format date */}
                  <td>{event.participationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VolunteerHistory;

