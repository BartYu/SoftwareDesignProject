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
};

export default Matching;
