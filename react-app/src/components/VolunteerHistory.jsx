import "./VolunteerHistory.css"; // Import your CSS file
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "./Navbar"; // Import the NavBar component

function VolunteerHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch volunteer history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005/volunteer-history",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <NavBar /> {/* NavBar is now outside the main content div */}
      <div className="volunteer-history-container">
        <Helmet>
          <title>Volunteer History</title>
        </Helmet>
        <h3>Volunteer History</h3>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Description</th>
                <th>Location</th>
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
                  <td>{event.eventDate}</td>
                  <td>{event.participationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VolunteerHistory;
