import React, { useState, useEffect } from "react";
import "./calendar.css";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/calendar/events");
        const data = await response.json();
        setAvailableEvents(data);
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

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    if (selectedEventId) {
      const selectedEvent = availableEvents.find(
        (event) => event.id === selectedEventId
      );
      if (selectedEvent) {
        const formattedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          selectedDate
        );

        const eventExists = events.some(
          (event) =>
            event.title === selectedEvent.title &&
            event.date.toDateString() === formattedDate.toDateString()
        );

        if (eventExists) {
          alert("This event already exists on this date.");
          return;
        }

        setEvents((prevEvents) => [
          ...prevEvents,
          { ...selectedEvent, date: formattedDate },
        ]);
        resetModal();
      }
    }
  };

  const resetModal = () => {
    setSelectedEventId(null);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
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
        (event) => event.date.toDateString() === date.toDateString()
      );

      days.push(
        <div className="day" key={day} onClick={() => handleDateClick(day)}>
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

  const getAvailableEvents = () => {
    const addedEventTitles = events.map((event) => event.title);
    return availableEvents.filter(
      (event) => !addedEventTitles.includes(event.title)
    );
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

        {isModalOpen && (
          <div className="modal">
            <div>
              <h3>
                Add Event for {selectedDate}{" "}
                {currentDate.toLocaleString("default", { month: "long" })}
              </h3>
              <select
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                value={selectedEventId || ""}
              >
                <option value="" disabled>
                  Select an event
                </option>
                {getAvailableEvents().map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={resetModal}>Cancel</button>
            </div>
          </div>
        )}

        <div className="event-list">
          <h3>Events</h3>
          {events.length === 0 ? (
            <p>No events added.</p>
          ) : (
            events.map((event) => {
              const date = event.date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              return (
                <div key={event.id} className="event-item">
                  <div className="event-details">
                    <strong>{event.title}</strong> on {date}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
