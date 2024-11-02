import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import './matching.css'; 
import './login.css';

const Matching = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await fetch("http://localhost:5005/macho/matches", {
                method: 'GET',
                mode: "cors",
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
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching matches for this event');
            }

            const data = await response.json();
            setEvents(prevEvents => 
                prevEvents.map(event => 
                    event.id === eventId 
                        ? { ...event, matched_volunteers: data } 
                        : event
                )
            );

            window.location.reload();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteMatch = async (eventId, volunteerId) => {
        if (!window.confirm("Are you sure you want to delete this match?")) {
            return;
        }

        setLoading(true);
        setError(null);
        console.log(`Deleting match: Event ID ${eventId}, Volunteer ID ${volunteerId}`);

        try {
            const response = await fetch(`http://localhost:5005/macho/matches/${eventId}/${volunteerId}`, {
                method: 'DELETE',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting match');
            }

            window.location.reload();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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
                                  <h2 className="event-title">{event.title}</h2>
                                  <h3 className="event-date">{event.date}</h3>
                                  <span className="event-priority">Priority: {event.priority}</span>
                                  <button className="match-button" onClick={() => fetchMatchesForEvent(event.id)}>
                                      Match Volunteers
                                  </button>
                                  {event.matched_volunteers && event.matched_volunteers.length > 0 ? (
                                      <ul>
                                          {event.matched_volunteers.map((match, index) => (
                                              <li key={index}>
                                                  <span className="match-info">
                                                      Volunteer {match[0]} matched with Event {event.title}
                                                  </span>
                                                  <button className="delete-button" onClick={() => handleDeleteMatch(event.id, match[1])}>
                                                      Delete
                                                  </button>
                                              </li>
                                          ))}
                                      </ul>
                                  ) : (
                                      <li>No volunteers matched yet.</li>
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
