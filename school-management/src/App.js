
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Students from "./pages/students/Students";
import Classes from "./pages/classes/Classes";
import ClassDetails from "./pages/classes/ClassDetails";
import Payments from "./pages/payments/Payments";
import Grades from "./pages/grades/Grades";
import Attendance from "./pages/attendance/Attendance";
import Teachers from "./pages/teachers/Teachers"; 

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["Admin", "Enseignant", "Comptable"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* STUDENTS */}
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={["Admin", "Enseignant"]}>
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* CLASSES */}
        <Route
          path="/classes"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Layout>
                <Classes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Layout>
                <ClassDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PAYMENTS */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute roles={["Admin", "Comptable"]}>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* GRADES */}
        <Route
          path="/grades"
          element={
            <ProtectedRoute roles={["Admin", "Enseignant"]}>
              <Layout>
                <Grades />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ATTENDANCE */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute roles={["Admin", "Enseignant"]}>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* TEACHERS  */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Layout>
                <Teachers />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </Router>
  );
}

export default App;
