import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import './matching.css'; 
import './login.css';

const Matching = () => {
    const [events, setEvents] = useState([]);
    const [matches, setMatches] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await fetch("http://localhost:5005/macho/matches", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching events');
            }

            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMatchesForEvent = async (eventId) => {
        setLoading(true);
        setError(null); 
        try {
            const response = await fetch(`http://localhost:5005/macho/match/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching matches for this event');
            }

            const data = await response.json();
            setMatches(prevMatches => ({
                ...prevMatches,
                [eventId]: data,
            }));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMatch = (eventId, matchIndex) => {
        setMatches(prevMatches => ({
            ...prevMatches,
            [eventId]: prevMatches[eventId].filter((_, index) => index !== matchIndex),
        }));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
      <div>
          <Navbar />
          <div className="matchingContainer">
              <h1>Current Events</h1>
              {loading ? (
                  <div className="spinner"></div> 
              ) : (
                  <>
                      {error && <div>Error: {error}</div>}
                      {events.length > 0 ? (
                          events.map(event => (
                              <div key={event.id} className="event-container">
                                  <h2>{event.title} ({event.date}) - Priority: {event.priority}</h2>
                                  <button className="match-button" onClick={() => fetchMatchesForEvent(event.id)}>
                                      Match Volunteers
                                  </button>
                                  {matches[event.id] && (
                                      <ul>
                                          {matches[event.id].length > 0 ? (
                                              matches[event.id].map((match, index) => (
                                                  <li key={index}>
                                                      <span className="match-info">
                                                          Volunteer {match.volunteerName} matched with Event {match.eventTitle} on {match.date}
                                                      </span>
                                                      <button className="delete-button" onClick={() => handleDeleteMatch(event.id, index)}>
                                                          Delete
                                                      </button>
                                                  </li>
                                              ))
                                          ) : (
                                              <li>No volunteers matched yet.</li>
                                          )}
                                      </ul>
                                  )}
                              </div>
                          ))
                      ) : (
                          <div>No events found.</div>
                      )}
                  </>
              )}
          </div>
      </div>
  );
  
};

export default Matching;
