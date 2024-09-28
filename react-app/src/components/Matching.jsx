import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import './matching.css'; 

const Matching = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
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
                    throw new Error('error');
                }

                const data = await response.json();
                setMatches(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const handleDeleteMatch = (matchIndex) => {
        setMatches(prevMatches => prevMatches.filter((_, index) => index !== matchIndex));
    };

    if (loading) {
        return <div>Loading</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar /> 
            <div className="matchingContainer"> 
                <h1>Current Matches</h1>
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
