import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Attendance.module.css";

function Attendance() {
  const [employee, setEmployee] = useState(null);
  const [date, setDate] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [totalHours, setTotalHours] = useState("-");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [status, setStatus] = useState("-");
  const [attendanceId, setAttendanceId] = useState("");
  const [latestId, setLatestId] = useState(0); //! State variable to keep track of the latest ID
  const [error, setError] = useState(null); //! State variable for handling errors
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // Fetch employee details
    axios.get("http://localhost:8000/employees")
      .then(response => {
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInEmployee"));
        const loggedInUsername = loggedInUser ? loggedInUser.username : "";
        const loggedInEmployee = response.data.find(emp => emp.username === loggedInUsername);
        if (loggedInEmployee) {
          setEmployee(loggedInEmployee);
          if (loggedInEmployee.attendance) {
            const history = Object.entries(loggedInEmployee.attendance).map(([date, details]) => ({
              date,
              ...details,
            }));
            setAttendanceHistory(history);
          }
          //! Fetch attendance history immediately after setting the employee state
          fetchAttendanceHistory(loggedInEmployee.username);
          //! Fetch the latest ID for incrementing 
          fetchLatestId();
        } else {
          setError("Logged in employee not found.");
        }
      })
      .catch(error => {
        setError("Error fetching employee details: " + error.message);
      });

    // Fetch holidays
    axios.get("http://localhost:8000/holiday")
      .then(response => {
        setHolidays(response.data);
      })
      .catch(error => {
        setError("Error fetching holidays: " + error.message);
      });
      
    // Initialize state variables using session storage data
    const storedData = sessionStorage.getItem("attendanceData");
    if (storedData) {
      const { date, loginTime, logoutTime, startLocation, endLocation, status, attendanceId } = JSON.parse(storedData);
      setDate(date);
      setLoginTime(loginTime);
      setLogoutTime(logoutTime);
      setStartLocation(startLocation);
      setEndLocation(endLocation);
      setStatus(status);
      setAttendanceId(attendanceId);
      calculateTotalHours(loginTime, logoutTime);
    }
  }, []);

  // Function to fetch the latest ID from the server
  const fetchLatestId = async () => {
    try {
      const response = await axios.get("http://localhost:8000/attendance");
      const attendanceData = response.data;
      let maxId = 0;
      attendanceData.forEach(item => {
        const id = parseInt(item.id);
        if (id > maxId) {
          maxId = id;
        }
      });
      setLatestId(maxId);
    } catch (error) {
      setError("Error fetching latest ID: " + error.message);
    }
  };

  // Function to increment ID
  const incrementId = async () => {
    try {
      const newId = latestId + 1; // Increment latest ID by 1
      setLatestId(newId); // Update latest ID in state
      return newId.toString(); // Return the incremented ID
    } catch (error) {
      setError("Error incrementing ID: " + error.message);
      return null;
    }
  };

  const handleMarkAttendance = async () => {
    try {
      // Check if current date is a holiday
      const currentDate = new Date();
      const formattedCurrentDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
      const isHoliday = holidays.find(holiday => holiday.date === formattedCurrentDate);
      
      if (isHoliday) {
        alert(`You cannot mark attendance on the occasion of ${isHoliday.holidayName} Holiday.`);
        return;
      }

      // Continue with marking attendance if not a holiday
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
      const formattedTime = `${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      setDate(formattedDate);
      setLoginTime(formattedTime);
      setStatus("-"); // Set status to Present when marking attendance

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setStartLocation(
              `${position.coords.latitude},${position.coords.longitude}`
            );

            const newAttendanceId = await incrementId(); // Generate unique ID
            if (!newAttendanceId) {
              throw new Error("Error generating new ID.");
            }

            const attendanceData = {
              id: newAttendanceId,
              employeeId: employee.id,
              username: employee.username,
              date: formattedDate,
              loginTime: formattedTime,
              startLocation: `${position.coords.latitude},${position.coords.longitude}`,
              logoutTime: "",
              endLocation: "",
              totalHours: "",
              status: "-",
            };

            // Store attendance data in db.json
            const dbResponse = await axios.post("http://localhost:8000/attendance", attendanceData);
            console.log(dbResponse.data);

            // Store attendance data in session storage
            const attendanceDataForStorage = {
              date: formattedDate,
              loginTime: formattedTime,
              startLocation: `${position.coords.latitude},${position.coords.longitude}`,
              logoutTime: "",
              totalHours: "",
              endLocation: "",
              status: "-",
              attendanceId: newAttendanceId,
            };
            sessionStorage.setItem("attendanceData", JSON.stringify(attendanceDataForStorage));

            // Update attendance history
            setAttendanceHistory([...attendanceHistory, attendanceData]);

            // Update attendance ID and fetch updated attendance history
            setAttendanceId(newAttendanceId);
            fetchAttendanceHistory(employee.username);
          },
          (error) => {
            setStartLocation("Error fetching location");
            // Clear only the current attendance record fields
            clearCurrentRecordFields();
            // Show alert to the user
            alert("Error fetching coordinates. Please try again.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setStartLocation("Geolocation not supported");
      }
    } catch (error) {
      setError("Error marking attendance: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      // Check if current date is a holiday
      const currentDate = new Date();
      const formattedCurrentDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
      const isHoliday = holidays.find(holiday => holiday.date === formattedCurrentDate);
      
      if (isHoliday) {
        alert(`You cannot logout on ${isHoliday.name} holiday.`);
        return;
      }

      // Continue with logging out if not a holiday
      const formattedTime = `${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      setLogoutTime(formattedTime);
      setStatus("P"); // Set status to Present when logging out

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setEndLocation(
              `${position.coords.latitude},${position.coords.longitude}`
            );

            const totalHours = calculateTotalHours(loginTime, formattedTime);

            const attendanceData = {
              id: attendanceId,
              employeeId: employee.id,
              username: employee.username,
              date,
              loginTime,
              logoutTime: formattedTime,
              startLocation,
              endLocation: `${position.coords.latitude},${position.coords.longitude}`,
              totalHours,
              status: "P",
            };

            const response = await axios.put(`http://localhost:8000/attendance/${attendanceId}`, attendanceData);
            console.log(response.data);
            fetchAttendanceHistory(employee.username);

            // Remove attendance data from session storage on logout
            sessionStorage.removeItem("attendanceData");
          },
          (error) => {
            setEndLocation("Error fetching location");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setEndLocation("Geolocation not supported");
      }
    } catch (error) {
      setError("Error logging out: " + error.message);
    }
  };

  const fetchAttendanceHistory = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/attendance?username=${username}`);
      const filteredAttendanceHistory = response.data.filter(item => !Object.values(item).some(value => value === ""));
      const rev = filteredAttendanceHistory.reverse();
      setAttendanceHistory(rev);
    } catch (error) {
      setError("Error fetching attendance history: " + error.message);
    }
  };

  const clearCurrentRecordFields = () => {
    setDate("");
    setLoginTime("");
    setLogoutTime("");
    setTotalHours("-");
    setStartLocation("");
    setEndLocation("");
    setStatus("");
    setAttendanceId("");
  };

  const calculateTotalHours = (startTime, endTime) => {
    if (!startTime || !endTime) {
      setTotalHours("-");
      return null;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const totalMilliseconds = end.getTime() - start.getTime();
    const totalSeconds = Math.floor((totalMilliseconds / 1000) % 60);
    const totalMinutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));

    const formattedTotalHours = `${totalHours.toString().padStart(2, '0')}:${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`;
    setTotalHours(formattedTotalHours);
    return formattedTotalHours;
  };

  return (
    <div>
      <h2>Attendance</h2>
      {error && error.includes("Error getting start location") && (
        <div className={styles.errorMessage}>{error}</div>
      )}
      <div style={{ marginBottom: "10px", textAlign: "left" }}>
        <button className="btn btn-primary" onClick={handleMarkAttendance} disabled={holidays.some(holiday => holiday.date === date)}>
          Mark Attendance
        </button>
      </div>
      {employee && (
        <div className={styles.tableContainer} style={{ maxHeight: "600px", overflowY: "scroll" }}>
          <table className={`table table-bordered ${styles.table}`} style={{ fontSize: '19px' }}>
            <thead className={`table-dark sticky-top ${styles.stickyTop}`}>
              <tr>
                <th>Date</th>
                <th>Login Time</th>
                <th>Start Location</th>
                <th>Logout Time</th>
                <th>End Location</th>
                <th>Total Hours</th>
                <th>Status</th> 
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{date}</td>
                <td>{loginTime}</td>
                <td>{startLocation}</td>
                <td>{logoutTime}</td>
                <td>{endLocation}</td>
                <td>{totalHours}</td>
                <td>{status}</td> 
                <td>
                  {logoutTime ? (
                    <button className="btn btn-secondary" disabled>
                      Logged Out
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={handleLogout} disabled={holidays.some(holiday => holiday.date === date)}>
                      Logout
                    </button>
                  )}
                </td>
              </tr>
              {attendanceHistory.length > 0 &&
                attendanceHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.loginTime}</td>
                    <td>{item.startLocation}</td>
                    <td>{item.logoutTime}</td>
                    <td>{item.endLocation}</td>
                    <td>{item.totalHours}</td>
                    <td>{item.status}</td> 
                    <td>
                      Done
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance;