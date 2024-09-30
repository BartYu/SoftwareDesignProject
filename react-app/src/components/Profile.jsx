import "./Profile.css";
import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import { usStates } from "./states";
import Navbar from "./Navbar";

const Profile = () => {
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

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

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const showProfile = await response.json();
        setFullName(showProfile.name);
        setAddress1(showProfile.address1);
        setAddress2(showProfile.address2 || "");
        setCity(showProfile.city);
        setSelectedState(showProfile.state);
        setZipCode(showProfile.zip);
        setSkills(
          showProfile.skills.map((skill) => ({ value: skill, label: skill }))
        );
        setPreferences(showProfile.preferences || "");
        setSelectedDates(
          showProfile.dates.map((date) => {
            const localDate = new Date(date);
            return new Date(
              localDate.getTime() + localDate.getTimezoneOffset() * 60000
            ); // Adjust for timezone offset
          })
        );
      } else {
        console.error("Profile not found.");
      }
    } catch (error) {
      console.error("Error fetching profile.", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const SaveChanges = async (event) => {
    event.preventDefault();
    setErrors({});

    console.log("Details of Selected Dates:", selectedDates);
    selectedDates.forEach((date, index) => {
      console.log(`Date ${index}:`, date);
    });

    const profileData = {
      name: fullName,
      address1: address1,
      address2: address2,
      city: city,
      state: selectedState,
      zip: zipCode,
      skills: skills.map((skill) => skill.value),
      preferences: preferences,
      dates: selectedDates.map((date) => date.format("MM/DD/YYYY")),
    };
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      const responseData = await response.json();

      if (!response.ok) {
        setErrors(responseData.errors);
        console.error("Error from backend:", responseData);
        //alert("Error:" + JSON.stringify(responseData.errors));
        return;
      }
      alert("Profile saved successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile changes.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleZip = (event) => {
    const { key } = event;
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];

    // Allow numbers and hyphen only
    if (!allowedKeys.includes(key) && !/[\d-]/.test(key)) {
      event.preventDefault(); // Prevent the input if not allowed
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
          onSubmit={SaveChanges}
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
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.join(", ")}</div>
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
              onChange={(e) => {
                setAddress1(e.target.value);
                if (errors.address1)
                  setErrors((prev) => ({ ...prev, address1: null }));
              }}
              className={`form-control ${errors.address1 ? "is-invalid" : ""}`}
            />
            {errors.address1 && (
              <div className="invalid-feedback">
                {errors.address1.join(", ")}
              </div>
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
              onChange={(e) => {
                setCity(e.target.value);
                if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
              }}
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city.join(", ")}</div>
            )}
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
                if (errors.state)
                  setErrors((prev) => ({ ...prev, state: null }));
              }}
              className={`form-select ${errors.state ? "is-invalid" : ""}`}
            >
              <option disabled value=""></option>
              {usStates.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="invalid-feedback">{errors.state.join(", ")}</div>
            )}
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
              maxLength="10"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                if (errors.zip) setErrors((prev) => ({ ...prev, zip: null }));
              }}
              onKeyDown={handleZip}
              className={`form-control ${errors.zip ? "is-invalid" : ""}`}
            />
            {errors.zip && (
              <div className="invalid-feedback">{errors.zip.join(", ")}</div>
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
              onChange={(selectedOptions) => {
                setSkills(selectedOptions || []);
                if (selectedOptions && selectedOptions.length > 0) {
                  setErrors((prev) => ({ ...prev, skills: null }));
                }
              }}
              className={errors.skills ? "is-invalid" : ""}
            />
            {errors.skills && (
              <div className="invalid-feedback">{errors.skills.join(", ")}</div>
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

          {/* Dates Selection */}
          <div className="col-md-6 dates">
            <label htmlFor="dates" className="form-label">
              Availability: *
            </label>
            <div className="dates-container">
              <DatePicker
                id="dates"
                mode="multiple"
                format="MM/DD/YYYY"
                value={selectedDates}
                onChange={(dates) => {
                  setSelectedDates(dates || []);
                  if (dates && dates.length > 0) {
                    setErrors((prev) => ({ ...prev, dates: null }));
                  }
                }}
                className="date-picker"
                editable={false}
                minDate={new Date()}
              />
              <button
                type="button"
                className="btn btn-danger clear-dates"
                onClick={() => {
                  const updatedDates = selectedDates.slice(0, -1);
                  setSelectedDates(updatedDates);
                  if (updatedDates.length === 0) {
                    setErrors((prev) => ({ ...prev, dates: null }));
                  }
                }}
              >
                Remove
              </button>
            </div>
            {Array.isArray(errors.dates) && (
              <div className="error-message">{errors.dates.join(", ")}</div>
            )}
          </div>

          <div className="saveButton col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div> Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
