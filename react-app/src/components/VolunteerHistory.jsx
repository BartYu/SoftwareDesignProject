import React, { useState } from "react";
import "./VolunteerHistory.css"; // Create this CSS file for styling
import Navbar from "./Navbar";

const VolunteerHistory = () => {
  const [volunteerData, setVolunteerData] = useState([
    {
      eventName: "Community Cleanup",
      eventDescription: "Cleaning up the local park.",
      location: "Central Park",
      requiredSkills: "Teamwork, Communication",
      urgency: "High",
      eventDate: "2024-09-20",
      participationStatus: "Completed",
    },
    {
      eventName: "Food Drive",
      eventDescription: "Collecting food for the needy.",
      location: "Downtown Community Center",
      requiredSkills: "Organization, Communication",
      urgency: "Medium",
      eventDate: "2024-08-15",
      participationStatus: "Pending",
    },
    // Add more volunteer data as needed
  ]);

  return (
    <div className="history">
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
