import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

function VolunteerHistory() {
  const [history, setHistory] = useState([]);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: "",
    urgency: "",
    eventDate: "",
    participationStatus: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch volunteer history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/volunteer-history");
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/volunteer-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error);
      }

      const newEvent = await response.json();
      setHistory((prevHistory) => [...prevHistory, newEvent]);
      setEventData({
        eventName: "",
        eventDescription: "",
        location: "",
        requiredSkills: "",
        urgency: "",
        eventDate: "",
        participationStatus: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Volunteer History</title>
      </Helmet>
      <h3>Your Volunteer History</h3>
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
      <form onSubmit={handleSubmit}>
        <h4>Add a New Volunteer Event</h4>
        <input type="text" name="eventName" placeholder="Event Name" value={eventData.eventName} onChange={handleInputChange} required />
        <input type="text" name="eventDescription" placeholder="Event Description" value={eventData.eventDescription} onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" value={eventData.location} onChange={handleInputChange} required />
        <input type="text" name="requiredSkills" placeholder="Required Skills" value={eventData.requiredSkills} onChange={handleInputChange} required />
        <input type="text" name="urgency" placeholder="Urgency" value={eventData.urgency} onChange={handleInputChange} required />
        <input type="date" name="eventDate" value={eventData.eventDate} onChange={handleInputChange} required />
        <input type="text" name="participationStatus" placeholder="Participation Status" value={eventData.participationStatus} onChange={handleInputChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>
    </div>
  );
}

export default VolunteerHistory;
