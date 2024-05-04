import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard/AdminDashboard";
import EmployeeDashboard from "./Employees/EmployeeDashboard/EmployeeDashboard";
import AdminLogin from "./Admin/AdminLogin/AdminLogin";
import EmployeeRegistration from "./Employees/EmployeeRegistration/EmployeeRegistration";
import EmployeeLogin from "./Employees/EmployeeLogin/EmployeeLogin";
import EmployeeDetails from "./Employees/EmployeeDetails/EmployeeDetails";
import EmployeeAttendance from "./Attendance/EmployeeAttendance/EmployeeAttendance";
import MyProfile from "./Employees/Employee Profile/MyProfile";
import Attendance from "./Attendance/Attendance/Attendance";
import EmployeeAddPage from "./Employees/EmployeeDetails/EmployeeAddPage";
import EmployeeEditPage from "./Employees/EmployeeDetails/EmployeeEditPage"; 
import Leaves from "./Leaves/Leaves/Leaves";
import EmployeeLeaves from "./Leaves/EmployeeLeaves/EmployeeLeaves";
import ManageLeaves from "./Leaves/ManageLeaves/ManageLeaves";
import Holidays from "./Leaves/Holidays/Holidays";
import AttendanceRecords from "./Attendance/AttendanceRecords/AttendanceRecords";
import EditLeaves from "./Leaves/EmployeeLeaves/EditLeaves";
import ForgetPassword from "./Employees/EmployeeLogin/ForgetPassword";

function App() {
  const [loggedInEmployee, setLoggedInEmployee] = useState(() => {
    // Check if there is logged-in employee data in session storage
    const loggedEmployee = sessionStorage.getItem('loggedInEmployee');
    return loggedEmployee ? JSON.parse(loggedEmployee) : null;
  });

  const handleLogin = (employee) => {
    setLoggedInEmployee(employee);
    // Store logged-in employee data in session storage
    sessionStorage.setItem('loggedInEmployee', JSON.stringify(employee));
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
    // Clear logged-in employee data from session storage
    sessionStorage.removeItem('loggedInEmployee');
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<EmployeeLogin onLogin={handleLogin} />}
          />
          <Route
            path="employee-login"
            element={<EmployeeLogin onLogin={handleLogin} />}
          />
          <Route path="forget-password" element={<ForgetPassword/>}/>
          <Route path="/employee-registration" element={<EmployeeRegistration />} />
          <Route path="/employee-dashboard/" element={ <EmployeeDashboard loggedInEmployee={loggedInEmployee} onLogout={handleLogout} /> } >
            <Route index element={<MyProfile loggedInEmployee={loggedInEmployee} />} />
            <Route path="profile" element={ <MyProfile loggedInEmployee={loggedInEmployee} /> } />
            <Route path="attendance" element={ <Attendance loggedInEmployee={loggedInEmployee} /> } />
            <Route path="leaves" element={<Leaves loggedInEmployee={loggedInEmployee} /> } />
          </Route>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard/" element={ <AdminDashboard loggedInEmployee={loggedInEmployee} onLogout={handleLogout} /> }>
            <Route index element={<EmployeeDetails loggedInEmployee={loggedInEmployee} />} />
            <Route path="employee-details" element={ <EmployeeDetails loggedInEmployee={loggedInEmployee} /> } />
            <Route path="employee-attendance" element={ <EmployeeAttendance loggedInEmployee={loggedInEmployee} /> } />
            <Route path="attendance-records" element={ <AttendanceRecords loggedInEmployee={loggedInEmployee} /> } />
            <Route path="employee-leaves" element={ <EmployeeLeaves loggedInEmployee={loggedInEmployee} /> } />
            <Route path="manage-leaves" element={ <ManageLeaves loggedInEmployee={loggedInEmployee} /> } />
            <Route path="holidays" element={ <Holidays loggedInEmployee={loggedInEmployee} /> } />
          </Route>
          <Route path="/add-employee" element={<EmployeeAddPage/>} />
          <Route path="/edit-employee/:id" element={<EmployeeEditPage />} />
          <Route path="/Update/:id" element={<EditLeaves/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
