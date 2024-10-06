import React, { useState, useEffect } from "react";
import "./VolunteerHistory.css"; // Ensure this is updated with any new styles
import Navbar from "./Navbar";

const VolunteerHistory = () => {
  const [volunteerData, setVolunteerData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/volunteers');
        if (!response.ok) throw new Error("Failed to fetch volunteer data");
        const data = await response.json();
        setVolunteerData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVolunteerData();
  }, []);

  return (
    <div className="history">
      <Navbar />
      <div className="volunteer-history-container">
        <h1>Volunteer History</h1>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Description</th>
              <th>Location</th>
              <th>Required Skills</th>
              <th>Urgency</th>
              <th>Event Date</th>
              <th>Participation Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteerData.length > 0 ? (
              volunteerData.map((volunteer, index) => (
                <tr key={index} className={volunteer.participationStatus === "Completed" ? "completed" : "pending"}>
                  <td>{volunteer.eventName}</td>
                  <td>{volunteer.eventDescription}</td>
                  <td>{volunteer.location}</td>
                  <td>{volunteer.requiredSkills}</td>
                  <td>{volunteer.urgency}</td>
                  <td>{volunteer.eventDate}</td>
                  <td>{volunteer.participationStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No volunteer events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;

