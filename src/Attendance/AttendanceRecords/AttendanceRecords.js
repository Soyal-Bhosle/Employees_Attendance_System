import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttendanceRecords.css"; // Import the CSS file

function AttendanceRecords() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8000/attendance");
        setAttendanceRecords(response.data);
      } catch (error) {
        setError("Error fetching attendance records");
      }
    };

    const fetchHolidays = async () => {
      try {
        const response = await axios.get("http://localhost:8000/holiday");
        setHolidays(response.data);
      } catch (error) {
        setError("Error fetching holidays");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8000/employees");
        setEmployees(response.data.map((emp) => emp.username));
      } catch (error) {
        setError("Error fetching employees");
      }
    };

    fetchAttendanceRecords();
    fetchHolidays();
    fetchEmployees();
  }, []);

  const filterRecords = () => {
    if (!searchUsername) {
      setError("Please select username.");
      return;
    }

    if (!fromDate) {
      setError("Please provide a valid from date.");
      return;
    }

    if (!toDate) {
      setError("Please select both 'From' and 'To' dates.");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    const filtered = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate >= fromDateObj &&
        recordDate <= toDateObj &&
        record.username &&
        record.username.toLowerCase() === searchUsername.toLowerCase()
      );
    });

    setFilteredRecords(filtered);
    setSelectedDates(getSelectedDates(fromDateObj, toDateObj));

    if (filtered.length === 0) {
      setError("No data available for the selected criteria.");
    } else {
      setError(""); // Clear error if filtering was successful
    }
  };

  const getSelectedDates = (fromDate, toDate) => {
    const dates = [];
    for (let date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    return dates;
  };

  const handleSearch = () => {
    filterRecords();
  };

  const handleFetchAttendance = () => {
    handleSearch();
  };

  const renderDataColumn = (fieldName) => {
    const today = new Date();
    return selectedDates.map((date, index) => {
      const record = filteredRecords.find(
        (record) => new Date(record.date).toDateString() === date.toDateString()
      );
      const isFutureDate = date > today;
      const isHoliday =
        holidays.find(
          (holiday) =>
            new Date(holiday.date).toDateString() === date.toDateString()
        ) || date.getDay() === 0 || date.getDay() === 6;

      let cellValue = record
        ? record[fieldName]
        : fieldName === "status"
        ? isFutureDate
          ? ""
          : isHoliday
          ? "H"
          : "A"
        : "-";

      if (fieldName === "status") {
        cellValue = (
          <span
            style={{
              color:
                cellValue === "H" || cellValue === "A"
                  ? "red"
                  : cellValue === "P"
                  ? "green"
                  : "",
              fontWeight: "bold",
            }}
          >
            {cellValue}
          </span>
        );
      } else if (fieldName === "loginTime" || fieldName === "logoutTime") {
        if (isHoliday) {
          cellValue = "-";
        }
      }

      return <td key={index}>{cellValue}</td>;
    });
  };

  return (
    <div className="attendance-container-custom">
      <h1 className="record-heading-custom">Employee Attendance Records</h1>
      <div className="search-select-custom">
        <label htmlFor="searchInput">Search by Username: </label>
        <select
          id="searchInput"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        >
          <option value="">Select Username</option>
          {employees.map((emp) => (
            <option key={emp}>{emp}</option>
          ))}
        </select>
      </div>
      <div className="date-picker-custom">
        <span>From: </span>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <span>To: </span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div><br/>
      <button className="btn1 btn btn-primary" onClick={handleFetchAttendance}>
        Get
      </button>
      <br /><br/>
      {error && <p className="error">{error}</p>}
      <div className="scroll">
        {filteredRecords.length > 0 && (
          <table border={2}>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#202429", color: "white" }}>Date</th>
                {selectedDates.map((date, index) => (
                  <th key={index} style={{ color: date.getDay() === 0 || date.getDay() === 6 || holidays.find(h => new Date(h.date).toDateString() === date.toDateString()) ? 'red' : '' }}>
                    {`${date.getDate()} ${date.toLocaleString("en-US", {
                      month: "short",
                    })} (${date.toLocaleString("en-US", {
                      weekday: "short",
                    })})`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{backgroundColor:'#202429',color:'white'}}>Login Time</th>
                {renderDataColumn("loginTime")}
              </tr>
              <tr>
                <th style={{backgroundColor:'#202429',color:'white'}}>Logout Time</th>
                {renderDataColumn("logoutTime")}
              </tr>
              <tr>
                <th style={{backgroundColor:'#202429',color:'white'}}>Status</th>
                {renderDataColumn("status")}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceRecords;
