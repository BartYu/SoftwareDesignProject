import React, { useEffect, useState } from "react";
import "./VolunteerHistory.css"; 
import Navbar from "./Navbar";  // Ensure this component exists
import { Helmet } from "react-helmet";

const VolunteerHistory = () => {
  const [volunteerData, setVolunteerData] = useState([]);

  // Fetch volunteer history data from the backend
  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      const response = await fetch('/api/volunteer-history');
      const data = await response.json();
      setVolunteerData(data);
    };
    fetchVolunteerHistory();
  }, []);

  return (
    <div className="history">
      <Helmet>
        <title>Event History</title>
      </Helmet>
      <Navbar />
      <div className="volunteer-history-container">
        <h1>Volunteer History</h1>
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
            {volunteerData.map((volunteer, index) => (
              <tr key={index}>
                <td>{volunteer.eventName}</td>
                <td>{volunteer.eventDescription}</td>
                <td>{volunteer.location}</td>
                <td>{volunteer.requiredSkills}</td>
                <td>{volunteer.urgency}</td>
                <td>{volunteer.eventDate}</td>
                <td>{volunteer.participationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerHistory;
