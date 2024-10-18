
import "./VolunteerHistory.css"; // Import your CSS file
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";


function VolunteerHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch volunteer history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/volunteer-history", {
          method: "GET",
          credentials: "include",
        });

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
    <div className="volunteer-history-container"> {/* Use the container class */}
      <Helmet>
        <title>Volunteer History</title>
      </Helmet>
      <h3>Your Volunteer History</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {history.map((event, index) => (
          <li key={index}>
            <h4>{event.eventName}</h4>
            <p>{event.eventDescription}</p>
            <p>Location: {event.location}</p>
            <p>Skills Required: {event.requiredSkills}</p>
            <p>Urgency: {event.urgency}</p>
            <p>Date: {event.eventDate}</p>
            <p>Status: {event.participationStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VolunteerHistory;

