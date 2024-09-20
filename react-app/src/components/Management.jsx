import "./Management.css";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import Navbar from "./Navbar";

const Management = () => {

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState([]);
  const [eventDate, setEventDate] = useState("");

  const requiredSkillsList = [
    { value: "Adaptive", label: "Adaptive" },
    { value: "Creative", label: "Creative" },
    { value: "Problem-Solving", label: "Problem-Solving" },
    { value: "Patience", label: "Patience" },
    { value: "Teamwork", label: "Teamwork" },
    { value: "Compassion", label: "Compassion" },
    { value: "Communication", label: "Communication" },
    { value: "Leadership", label: "Leadership" },
  ];

  const urgencyList = [
    { value: "yes", label: "yes" },
    { value: "no", label: "no" },
  ];

  const [eventNameError, setEventNameError] = useState("");
  const [eventDescriptionError, setEventDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [requiredSkillsError, setRequiredSkillsError] = useState([]);
  const [urgencyError, setUrgencyError] = useState([]);
  const [eventDateError, setEventDateError] = useState("");

  const handleSubmission = (event) => {
    event.preventDefault();
    let hasError = false;

    // Validate fields
    if (eventName === "") {
      setEventNameError("Please enter the event name.");
      hasError = true;
    }
    if (eventDescription === "") {
      setEventDescriptionError("Please enter your event description.");
      hasError = true;
    }
    if (location === "") {
      setLocationError("Please enter the event location.");
      hasError = true;
    }
   
    if (requiredSkills.length === 0) {
      setRequiredSkillsError("Please select at least one skill.");
      hasError = true;
    }
    if (urgency.length === 0) {
      setUrgencyError("Please select the urgency information.");
      hasError = true;
    }
    if (eventDate.length === 0) {
      setEventDateError("Please select a date for the event.");
      hasError = true;
    }

    if (!hasError) {
      // Proceed with form submission logic
      alert("Management form updated successfully!");
    }
  };

  return (
    <div className="dashboard bg-dark bg-gradient min-vh-100">
      <Navbar />
      <div className="management">
        <h3>Management Information</h3>
        <form
          className="row g-3 needs-validation"
          noValidate
          onSubmit={handleSubmission}
        >
          {/* Event Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              maxLength="50"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`form-control ${eventNameError ? "is-invalid" : ""}`}
            />
            {eventNameError && (
              <div className="invalid-feedback">{eventNameError}</div>
            )}
          </div>

             {/* Event Description */}
          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
            Event Description *
            </label>
            <textarea 
              className={`form-control ${eventDescriptionError ? "is-invalid" : ""}`}
              id="description"
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
             {eventDescriptionError && <div className="invalid-feedback">{eventDescriptionError}</div>}
          </div>

             {/* Event Location */}
          <div className="col-md-12">
            <label htmlFor="location" className="form-label">
            Event Location *
            </label>
            <textarea
               className={`form-control ${locationError ? "is-invalid" : ""}`}
              id="location"
              rows="3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            ></textarea>
            {locationError && <div className="invalid-feedback">{locationError}</div>}
          </div>

          {/* Skills Selection */}
          <div className="col-md-6">
            <label htmlFor="skills" className="form-label">
              Required Skills *
            </label>
            <Select
              id="skills"
              options={requiredSkillsList}
              value={requiredSkills}
              isMulti
              onChange={(selectedOptions) => setRequiredSkills(selectedOptions || [])}
              className={requiredSkillsError ? "is-invalid" : ""}
            />
            {requiredSkillsError && (
              <div className="invalid-feedback">{requiredSkillsError}</div>
            )}
          </div>

          {/* urgency Selection */}
          <div className="col-md-6">
            <label htmlFor="urgency" className="form-label">
              Is urgent? *
            </label>
            <Select
              id="urgency"
              options={urgencyList}
              value={urgencyError}
              isMulti
              onChange={(selectedOptions) => setUrgency(selectedOptions || [])}
              className={urgencyError ? "is-invalid" : ""}
            />
            {urgencyError && (
              <div className="invalid-feedback">{urgencyError}</div>
            )}
          </div>

          {/* Date Selection */}
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">
              Event Dates: *
            </label>
            <DatePicker
              id="date"
              mode="multiple"
              value={eventDate}
              onChange={setEventDate}
            />
            {eventDateError && <div className="error-message">{eventDateError}</div>}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Management;
