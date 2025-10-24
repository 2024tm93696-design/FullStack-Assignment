import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/Authentication/LoginPage";
import RegisterPage from "./Components/Authentication/RegisterPage";
import StudentDashboard from './Components/Dashboard/StudentDashboard';
import TeacherDashboard from './Components/Dashboard/TeacherDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import ChangePassword from "./Components/Authentication/ChangePassword";
import NotFoundPage from "./Components/NotFoundPage"

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="/registerpage" element={<RegisterPage />} />
          <Route path="/studentDashboard" element={<StudentDashboard />} />
          <Route path="/teacherDashboard" element={<TeacherDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/404" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
