import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Authentication/LoginPage";
import RegisterPage from "./Components/Authentication/RegisterPage";
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import TeacherDashboard from './Components/Dashboard/TeacherDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';

function App() {
  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<LoginPage/>} />
          <Route path="/loginpage" element={<LoginPage/>} />
          <Route path="/registerpage" element={<RegisterPage/>} />
          <Route path="/studentDashboard" element={<StudentDashboard/>} />
          <Route path="/teacherDashboard" element={<TeacherDashboard/>} />
          <Route path="/adminDashboard" element={<AdminDashboard/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
