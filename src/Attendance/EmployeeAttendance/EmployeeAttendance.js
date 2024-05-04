// EmployeeAttendance.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EmployeeAttendance.module.css"; // Import CSS module for custom styles

function EmployeeAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    // Fetch all attendance records using Axios
    axios
      .get("http://localhost:8000/attendance")
      .then((response) => {
        setAttendanceRecords(response.data);
        setFilteredRecords(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance records:", error);
      });
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = attendanceRecords.filter((record) =>
      record.username.toLowerCase().includes(searchTerm)
    );
    setFilteredRecords(filtered);
    setSearchUsername(searchTerm);
  };

  const handleStartLocationClick = (startLocation) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${startLocation}`,
      "_blank"
    );
  };

  const handleEndLocationClick = (endLocation) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${endLocation}`,
      "_blank"
    );
  };

  return (
    <div className={styles["unique-attendance-container"]}>
      <h1>Employees Attendances</h1>
      <div className={styles["unique-search-container"]}>
        <label htmlFor="unique-searchInput">Search by Username: </label>
        <input
          type="text"
          id="unique-searchInput"
          value={searchUsername}
          onChange={handleSearch}
          className={styles["unique-search-input"]}
        />
      </div>
      <div className={styles["unique-table-container"]}>
        <table className={styles.uniqueTable}>
          <thead>
            <tr>
              <th className={styles["unique-table-heading"]}>Username</th>
              <th className={styles["unique-table-heading"]}>Date</th>
              <th className={styles["unique-table-heading"]}>Login Time</th>
              <th className={styles["unique-table-heading"]}>Start Location</th>
              <th className={styles["unique-table-heading"]}>Logout Time</th>
              <th className={styles["unique-table-heading"]}>End Location</th>
              <th className={styles["unique-table-heading"]}>Total Hours</th>
              <th className={styles["unique-table-heading"]}>View On Map</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.username}</td>
                <td>{record.date}</td>
                <td>{record.loginTime}</td>
                <td>{record.startLocation}</td>
                <td>{record.logoutTime}</td>
                <td>{record.endLocation}</td>
                <td>{record.totalHours}</td>
                <td className={styles["unique-action-buttons"]}>
                  <button
                    className={styles["unique-start-location-btn"]}
                    onClick={() =>
                      handleStartLocationClick(record.startLocation)
                    }
                  >
                    Start Location
                  </button>
                  <button
                    className={styles["unique-end-location-btn"]}
                    onClick={() => handleEndLocationClick(record.endLocation)}
                  >
                    End Location
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeAttendance;
