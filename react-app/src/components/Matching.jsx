import React, { useState } from 'react';
import { events, volunteers } from '../components/data';
import Navbar from "./Navbar";
import './matching.css'; 

const Matching = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [matches, setMatches] = useState([]);

    const handleMatch = () => {
        if (selectedVolunteer === null || selectedEvent === null) return;

        const newMatch = {
            volunteerId: selectedVolunteer,
            eventId: selectedEvent,
        };

        const existingMatch = matches.find(match => 
            match.volunteerId === newMatch.volunteerId && match.eventId === newMatch.eventId
        );

        if (existingMatch) {
            alert("This volunteer is already matched with this event.");
            return;
        }

        setMatches(prevMatches => [...prevMatches, newMatch]);
        setSelectedVolunteer(null);
        setSelectedEvent(null);
    };

    const handleDeleteMatch = (matchIndex) => {
        setMatches(prevMatches => prevMatches.filter((_, index) => index !== matchIndex));
    };

    const getVolunteerName = (id) => {
        const volunteer = volunteers.find(v => v.id === id);
        return volunteer ? volunteer.name : 'Unknown Volunteer';
    };

    const getEventTitle = (id) => {
        const event = events.find(e => e.id === id);
        return event ? event.title : 'Unknown Event';
    };

    return (
        <div>
            <Navbar /> 
            <div className="matchingContainer"> 
                <h1>Match Volunteers to Events</h1>

                <div>
                    <h2>Select Volunteer</h2>
                    <select 
                        onChange={(e) => setSelectedVolunteer(Number(e.target.value))} 
                        value={selectedVolunteer || ''}
                    >
                        <option value="">Select a volunteer</option>
                        {volunteers.map(volunteer => (
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
                        value={selectedEvent || ''}
                    >
                        <option value="">Select an event</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button className="match-button" onClick={handleMatch}>Match</button>

                <h2>Current Matches</h2>
                <ul>
                    {matches.map((match, index) => (
                        <li key={index}>
                            Volunteer {getVolunteerName(match.volunteerId)} matched with Event {getEventTitle(match.eventId)}
                            <button className="delete-button" onClick={() => handleDeleteMatch(index)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Matching;
