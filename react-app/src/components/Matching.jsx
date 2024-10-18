import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import './matching.css'; 
import './login.css';

const Matching = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMatches = async () => {
        setLoading(true);
        setError(null); 
        try {
            await fetch("http://localhost:5000/macho/match", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const response = await fetch("http://localhost:5000/macho/matches", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching matches');
            }

            const data = await response.json();
            setMatches(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMatch = (matchIndex) => {
        setMatches(prevMatches => prevMatches.filter((_, index) => index !== matchIndex));
    };

    return (
        <div>
            <Navbar /> 
            <div className="matchingContainer"> 
                <h1>Current Matches</h1>
                <button className="match-button" onClick={fetchMatches}>Match</button>
                {loading && <div className="spinner"></div>}
                {error && <div>Error: {error}</div>}
                <ul>
                    {matches.length > 0 ? (
                        matches.map((match, index) => (
                            <li key={index}>
                                <span className="match-info">
                                    Volunteer {match.volunteerName} matched with Event {match.eventTitle} for {match.date} (Priority: {match.priority})
                                </span>
                                <button className="delete-button" onClick={() => handleDeleteMatch(index)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <li>No matches found.</li>
                    )}
                </ul>
            </div>
        </div>
    );

    if (existingMatch) {
      alert("This volunteer is already matched with this event.");
      return;
    }

    setMatches((prevMatches) => [...prevMatches, newMatch]);
    setSelectedVolunteer(null);
    setSelectedEvent(null);
  };

  const handleDeleteMatch = (matchIndex) => {
    setMatches((prevMatches) =>
      prevMatches.filter((_, index) => index !== matchIndex)
    );
  };

  const getVolunteerName = (id) => {
    const volunteer = volunteers.find((v) => v.id === id);
    return volunteer ? volunteer.name : "Unknown Volunteer";
  };

  const getEventTitle = (id) => {
    const event = events.find((e) => e.id === id);
    return event ? event.title : "Unknown Event";
  };

  return (
    <div>
      <Helmet>
        <title>Volunteer Matching</title>
      </Helmet>
      <Navbar />
      <div className="matchingContainer">
        <h1>Match Volunteers to Events</h1>

        <div>
          <h2>Select Volunteer</h2>
          <select
            onChange={(e) => setSelectedVolunteer(Number(e.target.value))}
            value={selectedVolunteer || ""}
          >
            <option value="">Select a volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2>Select Event</h2>
          <select
            onChange={(e) => setSelectedEvent(Number(e.target.value))}
            value={selectedEvent || ""}
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <button className="match-button" onClick={handleMatch}>
          Match
        </button>

        <h2>Current Matches</h2>
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              Volunteer {getVolunteerName(match.volunteerId)} matched with Event{" "}
              {getEventTitle(match.eventId)}
              <button
                className="delete-button"
                onClick={() => handleDeleteMatch(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Matching;
