import React, { useState, useEffect } from "react";
import "./calendar.css";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5005/calendar/events");
        const data = await response.json();
        console.log("Fetched events:", data);
        setEvents(data); 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const changeMonth = (delta) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + delta);
      return newDate;
    });
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5005/calendar/events/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchEvents();
            } else {
                console.error("Failed to delete event:", response.status, await response.json());
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }
  };


  const fetchEvents = async () => {
      try {
          const response = await fetch("http://localhost:5005/calendar/events");
          const data = await response.json();
          setEvents(data); 
      } catch (error) {
          console.error("Error fetching events:", error);
      }
  };



  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInMonth = getDaysInMonth(month, year);

    const days = Array.from({ length: firstDay }, (_, index) => (
      <div className="day empty" key={`empty-${index}`} />
    ));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );

      days.push(
        <div className="day" key={day}>
          <div>{day}</div>
          {dayEvents.map((event) => (
            <div key={event.id} className="event">
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <Helmet>
        <title>Event Calendar</title>
      </Helmet>
      <Navbar />
      <div className="calendar">
        <div className="header">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <h2>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>
        <div className="days-of-week">
          {daysInWeek.map((day) => (
            <div className="day" key={day}>
              {day}
            </div>
          ))}
        </div>
        <div className="days">{renderCalendar()}</div>

        <div className="event-list">
          <h3>Events</h3>
          {events.length === 0 ? (
            <p>No events available.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-details">
                  <strong>{event.title}</strong> on {new Date(event.date).toLocaleDateString()}
                  <div>Urgency: {event.priority}</div> 
                  <div>City: {event.city}</div> 
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
