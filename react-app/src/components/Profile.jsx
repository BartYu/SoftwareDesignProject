import "./Profile.css";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";

const Profile = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [skills, setSkills] = useState([]);
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
  const handleSkillsChange = (skills) => {
    setSkills(skills);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  return (
    <div className="userProfile">
      <h3>Profile Page</h3>
      <form className="row g-3 needs-validation" noValidate>
        {/* Name */}
        <div className="col-md-6">
          <label htmlFor="fullname" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            maxLength="50"
            required
          />
          <div className="invalid-feedback">
            Please provide a valid full name.
          </div>
        </div>
        {/* Address 1 */}
        <div className="col-md-6">
          <label htmlFor="address1" className="form-label">
            Address 1
          </label>
          <input
            type="text"
            className="form-control"
            id="address1"
            maxLength="100"
            required
          />
          <div className="invalid-feedback">
            Please provide a valid address.
          </div>
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
          />
        </div>
        {/* City */}
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            maxLength="100"
            required
          />
          <div className="invalid-feedback">Please provide a valid city.</div>
        </div>
        {/* State */}
        <div className="col-md-3">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <select className="form-select" id="state" required>
            <option selected disabled value="">
              Choose...
            </option>
          </select>
          <div className="invalid-feedback">Please select a state.</div>
        </div>
        {/* Zip code */}
        <div className="col-md-3">
          <label htmlFor="zip" className="form-label">
            Zip code
          </label>
          <input
            type="text"
            className="form-control"
            id="zip"
            pattern="\d{5}"
            title="Invalid zip code"
            maxLength="9"
            required
          />
          <div className="invalid-feedback">
            Please provide a valid zip code.
          </div>
        </div>
        {/* Skills Selections */}
        <div className="col-md-6">
          <label htmlFor="skills"> Skills: </label>
          <Select
            options={skillOptions}
            value={skills}
            isMulti={true}
            onChange={handleSkillsChange}
          ></Select>
          <div className="invalid-feedback">
            Please select at least one skill.
          </div>
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
          ></textarea>
        </div>
        {/* Date selection */}
        <div className="col-md-6">
          <label htmlFor="date" className="form-label">
            Availability (multiple dates allowed)
          </label>
          <DatePicker
            id="date"
            mode="multiple"
            value={selectedDates}
            onChange={handleDateChange}
          />
          <div className="invalid-feedback">
            Please select your availability dates.
          </div>
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
