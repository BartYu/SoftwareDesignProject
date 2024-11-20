import "./Management.css";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";
import { usStates, skillOptions } from "./profile-info";

const Management = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState("");
  const [eventDate, setEventDate] = useState([]);

  const [eventNameError, setEventNameError] = useState("");
  const [eventDescriptionError, setEventDescriptionError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [zipcodeError, setZipcodeError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [requiredSkillsError, setRequiredSkillsError] = useState("");
  const [urgencyError, setUrgencyError] = useState("");
  const [eventDateError, setEventDateError] = useState("");

  const handleSubmission = async (event) => {
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
    if (address === "") {
      setAddressError("Please enter the event address.");
      hasError = true;
    }
    if (zipcode === "") {
      setZipcodeError("Please enter the zipcode.");
      hasError = true;
    }
    if (city === "") {
      setCityError("Please enter the city.");
      hasError = true;
    }
    if (selectedState === "") {
      setStateError("Please enter the state.");
      hasError = true;
    }
    if (requiredSkills.length === 0) {
      setRequiredSkillsError("Please select at least one skill.");
      hasError = true;
    }
    if (urgency === "") {
      setUrgencyError("Please select the urgency information.");
      hasError = true;
    }
    if (eventDate.length === 0) {
      setEventDateError("Please select a date for the event.");
      hasError = true;
    }
    console.log("Event date", eventDate);

    if (!hasError) {
      // Proceed with form submission logic
      const eventData = {
        name: eventName,
        description: eventDescription,
        address: address,
        zipcode: zipcode,
        city: city,
        state: selectedState,
        skills: requiredSkills.map((skill) => skill.value),
        urgency: urgency,
        date:
          eventDate instanceof Date
            ? eventDate.toLocaleDateString("en-US")
            : eventDate,
      };
      console.log("Event:", eventData.urgency);

      try {
        const response = await fetch("http://localhost:5005/event/management", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
        const responseData = await response.json();

        if (!response.ok) {
          console.error("Error from backend:", responseData);
          return;
        }
        window.location.reload();
        alert("Event created");
      } catch (error) {
        console.error("Error adding management info.", error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="dashboard">
      <Helmet>
        <title>Event Management</title>
      </Helmet>
      <Navbar />
      <div className="management">
        <h3>Event Information</h3>
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

          {/* Urgency Selection */}
          <div className="col-md-6">
            <label htmlFor="urgency" className="form-label">
              Urgency *
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className={`form-select ${urgencyError ? "is-invalid" : ""}`}
            >
              <option value="" disabled hidden>
                select urgency
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {urgencyError && (
              <div className="invalid-feedback">{urgencyError}</div>
            )}
          </div>

          {/* Event Description */}
          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
              Event Description *
            </label>
            <textarea
              className={`form-control ${
                eventDescriptionError ? "is-invalid" : ""
              }`}
              id="description"
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            {eventDescriptionError && (
              <div className="invalid-feedback">{eventDescriptionError}</div>
            )}
          </div>

          {/* Event Address */}
          <div className="col-md-12">
            <label htmlFor="address" className="form-label">
              Event Address *
            </label>
            <input
              className={`form-control ${addressError ? "is-invalid" : ""}`}
              id="address"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {addressError && (
              <div className="invalid-feedback">{addressError}</div>
            )}
          </div>

          {/* Zipcode */}
          <div className="col-md-6">
            <label htmlFor="zipcode" className="form-label">
              Zipcode *
            </label>
            <input
              type="text"
              id="zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className={`form-control ${zipcodeError ? "is-invalid" : ""}`}
            />
            {zipcodeError && (
              <div className="invalid-feedback">{zipcodeError}</div>
            )}
          </div>

          {/* City */}
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`form-control ${cityError ? "is-invalid" : ""}`}
            />
            {cityError && <div className="invalid-feedback">{cityError}</div>}
          </div>

          {/* State */}
          <div className="col-md-3">
            <label htmlFor="state" className="form-label">
              State *
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                if (stateError) setStateError(null);
              }}
              className={`form-select ${stateError ? "is-invalid" : ""}`}
            >
              <option disabled value=""></option>
              {usStates.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            {stateError && <div className="invalid-feedback">{stateError}</div>}
          </div>

          {/* Skills Selection */}
          <div className="col-md-6">
            <label htmlFor="skills" className="form-label">
              Required Skills *
            </label>
            <Select
              id="skills"
              options={skillOptions}
              value={requiredSkills}
              isMulti
              onChange={(selectedOptions) =>
                setRequiredSkills(selectedOptions || [])
              }
              className={requiredSkillsError ? "is-invalid" : ""}
            />
            {requiredSkillsError && (
              <div className="invalid-feedback">{requiredSkillsError}</div>
            )}
          </div>

          {/* Date Selection */}
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">
              Event Date: *
            </label>
            <DatePicker
              id="date"
              value={eventDate}
              onChange={setEventDate}
              format={"MM/DD/YYYY"}
            />
            {eventDateError && (
              <div className="error-message">{eventDateError}</div>
            )}
          </div>

          <div className="col-12 create-event">
            <button type="submit" className="btn btn-primary">
              Create event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Management;
