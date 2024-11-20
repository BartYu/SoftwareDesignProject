import React, { useState } from "react";
import Navbar from "./Navbar";
import "./report.css";

const Report = () => {
  const [reportFormat, setReportFormat] = useState("");
  const [reportType, setReportType] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormatChange = (event) => {
    setReportFormat(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reportFormat || !reportType) {
      setError("Please select both report type and format.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5005/report/generate_report", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          format: reportFormat,
          report_type: reportType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate the report");
      }

      const blob = await response.blob();
      const filename = reportFormat === "csv" ? `${reportType}_report.csv` : `${reportType}_report.pdf`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      setError("Error generating report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Navbar />
        <div className="report-container">
        <h1>Generate Report</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
                <label htmlFor="reportType">Select Report Type:</label>
                <select
                    id="reportType"
                    value={reportType}
                    onChange={handleReportTypeChange}
                    className="form-control"
                >
                    <option value="">-- Select Report Type --</option>
                    <option value="volunteer_events_report">Volunteer Events Report</option>
                    <option value="event_details_report">Event Details Report</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="reportFormat">Select Report Format:</label>
                <select
                    id="reportFormat"
                    value={reportFormat}
                    onChange={handleFormatChange}
                    className="form-control"
                >
                    <option value="">-- Select Format --</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>

            <div className="form-group">
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Generating..." : "Generate Report"}
                </button>
            </div>
        </form>
        </div>
    </div>
  );
};

export default Report;
