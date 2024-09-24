import "./Profile.css";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import { usStates } from "./states";
import Navbar from "./Navbar";

const Profile = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [skills, setSkills] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [preferences, setPreferences] = useState("");

  const skillOptions = [
    { value: "Adaptive", label: "Adaptive" },
    { value: "Creative", label: "Creative" },
    { value: "Problem-Solving", label: "Problem-Solving" },
    { value: "Patience", label: "Patience" },
    { value: "Teamwork", label: "Teamwork" },
    { value: "Compassion", label: "Compassion" },
    { value: "Communication", label: "Communication" },
    { value: "Leadership", label: "Leadership" },
  ];

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [address1Error, setAddress1Error] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [datesError, setDatesError] = useState("");

  const handleSubmission = (event) => {
    event.preventDefault();

    // Reset error messages
    setFullNameError("");
    setAddress1Error("");
    setCityError("");
    setStateError("");
    setZipCodeError("");
    setSkillsError("");
    setDatesError("");

    let hasError = false;

    // Validate fields
    if (!fullName) {
      setFullNameError("Please enter your full name.");
      hasError = true;
    }
    if (!address1) {
      setAddress1Error("Please enter your address.");
      hasError = true;
    }
    if (!city) {
      setCityError("Please enter your city.");
      hasError = true;
    }
    if (!selectedState) {
      setStateError("Please select a state.");
      hasError = true;
    }
    if (!zipCode) {
      setZipCodeError("Please enter a zip code.");
      hasError = true;
    }
    if (skills.length === 0) {
      setSkillsError("Please select at least one skill.");
      hasError = true;
    }
    if (selectedDates.length === 0) {
      setDatesError("Please select your availability dates.");
      hasError = true;
    }

    if (!hasError) {
      // Proceed with form submission logic
      alert("Profile saved successfully!");
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="userProfile">
        <h3>Personal Information</h3>
        <form
          className="row g-3 needs-validation"
          noValidate
          onSubmit={handleSubmission}
        >
          {/* Full Name */}
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              maxLength="50"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`form-control ${fullNameError ? "is-invalid" : ""}`}
            />
            {fullNameError && (
              <div className="invalid-feedback">{fullNameError}</div>
            )}
          </div>

          {/* Address 1 */}
          <div className="col-md-6">
            <label htmlFor="address1" className="form-label">
              Address 1 *
            </label>
            <input
              type="text"
              id="address1"
              maxLength="100"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`form-control ${address1Error ? "is-invalid" : ""}`}
            />
            {address1Error && (
              <div className="invalid-feedback">{address1Error}</div>
            )}
          </div>

          {/* Address 2 */}
          <div className="col-md-6">
            <label htmlFor="address2" className="form-label">
              Address 2 (optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="address2"
              maxLength="100"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>

          {/* City */}
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">
              City *
            </label>
            <input
              type="text"
              id="city"
              maxLength="100"
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
              onChange={(e) => setSelectedState(e.target.value)}
              className={`form-select ${stateError ? "is-invalid" : ""}`}
            >
              <option disabled value="">
                ...
              </option>
              {usStates.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            {stateError && <div className="invalid-feedback">{stateError}</div>}
          </div>

          {/* Zip Code */}
          <div className="col-md-3">
            <label htmlFor="zip" className="form-label">
              Zip code *
            </label>
            <input
              type="text"
              id="zip"
              pattern="\d{5}(-\d{4})?"
              title="Invalid zip code"
              maxLength="10"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`form-control ${zipCodeError ? "is-invalid" : ""}`}
            />
            {zipCodeError && (
              <div className="invalid-feedback">{zipCodeError}</div>
            )}
          </div>

          {/* Skills Selection */}
          <div className="col-md-6">
            <label htmlFor="skills" className="form-label">
              Skills *
            </label>
            <Select
              id="skills"
              options={skillOptions}
              value={skills}
              isMulti
              onChange={(selectedOptions) => setSkills(selectedOptions || [])}
              className={skillsError ? "is-invalid" : ""}
            />
            {skillsError && (
              <div className="invalid-feedback">{skillsError}</div>
            )}
          </div>

          {/* Preferences */}
          <div className="col-md-12">
            <label htmlFor="preferences" className="form-label">
              Preferences (optional)
            </label>
            <textarea
              className="form-control"
              id="preferences"
              rows="3"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            ></textarea>
          </div>

          {/* Date Selection */}
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">
              Dates available: *
            </label>
            <DatePicker
              id="date"
              mode="multiple"
              value={selectedDates}
              onChange={setSelectedDates}
            />
            {datesError && <div className="error-message">{datesError}</div>}
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

export default Profile;
