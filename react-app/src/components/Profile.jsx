import "./Profile.css";
import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import Select from "react-select";
import { usStates, skillOptions } from "./profile-info";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";

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
  const [changes, hasChanges] = useState(false);
  const [toastAlert, setToastAlert] = useState(false);

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
        setZipCode(showProfile.zipcode);
        setSkills(
          showProfile.skills.map((skill) => ({ value: skill, label: skill }))
        );
        setPreferences(showProfile.preferences || "");
        setSelectedDates(
          showProfile.dates.map((date) => {
            const localDate = new Date(date);
            return new Date(
              localDate.getTime() + localDate.getTimezoneOffset() * 60000
            );
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

    // console.log("Details of Selected Dates:", selectedDates);
    // selectedDates.forEach((date, index) => {
    //   console.log(`Date ${index}:`, date);
    // });

    const profileData = {
      name: fullName,
      address1: address1,
      address2: address2,
      city: city,
      state: selectedState,
      zipcode: zipCode,
      skills: skills.map((skill) => skill.value),
      preferences: preferences,
      dates: selectedDates.map((date) => {
        return date instanceof Date ? date.toLocaleDateString("en-US") : date;
      }),
    };
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/user/profile", {
        method: "PUT",
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
      setToastAlert(true);
      setTimeout(() => setToastAlert(false), 3500);
      hasChanges(false);
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile changes.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Helmet>
        <title>Profile Page</title>
      </Helmet>
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
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setFullName(value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: null }));
                  hasChanges(true);
                }
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
                hasChanges(true);
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
              onChange={(e) => {
                setAddress2(e.target.value);
                hasChanges(true);
              }}
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
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setCity(value);
                  if (errors.city)
                    setErrors((prev) => ({ ...prev, city: null }));
                  hasChanges(true);
                }
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
                hasChanges(true);
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
            <label htmlFor="zipcode" className="form-label">
              Zip code *
            </label>
            <input
              type="text"
              id="zipcode"
              pattern="\d{5}(-\d{4})?"
              maxLength="10"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9-]*$/.test(value)) {
                  setZipCode(value);
                  if (errors.zipcode)
                    setErrors((prev) => ({ ...prev, zipcode: null }));
                  hasChanges(true);
                }
              }}
              className={`form-control ${errors.zipcode ? "is-invalid" : ""}`}
            />
            {errors.zipcode && (
              <div className="invalid-feedback">
                {errors.zipcode.join(", ")}
              </div>
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
                  hasChanges(true);
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
              onChange={(e) => {
                setPreferences(e.target.value);
                hasChanges(true);
              }}
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
                    hasChanges(true);
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
                  hasChanges(true);
                  const updatedDates = selectedDates.slice(0, -1);
                  setSelectedDates(updatedDates);
                  if (updatedDates.length === 0) {
                    setErrors((prev) => ({ ...prev, dates: null }));
                  }
                }}
                disabled={selectedDates.length === 0}
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
              disabled={loading || !changes}
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
      <div className={`toast-container position-fixed bottom-0 end-0 p-3`}>
        <div
          id="saveAlert"
          className={`toast ${toastAlert ? "show" : "hide"} bg-info fw-bold`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">Profile saved successfully!</div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              onClick={() => setToastAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
