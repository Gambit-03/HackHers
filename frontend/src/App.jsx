import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public / existing pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AadhaarVerification from "./pages/AadhaarVerification";

// Student Dashboard pages
import StudentDashboard from "./pages/StudentDashboard";
import MatchInternshipPage from "./pages/MatchInternshipPage";

// Admin Dashboard pages
import AdminDashboard from "./pages/AdminDashboard";
import RecruiterVerified from "./components/admin/RecruiterVerified";
import VerifiedCompanies from "./components/admin/VerifiedCompanies";
import Analytics from "./components/admin/Analytics";
import ReportGeneration from "./components/admin/ReportGeneration";

// 🔥 Recruiter Dashboard pages
import RecruiterDashboard from "./pages/RecruiterDashboard";
import VerifyProfile from "./components/recruiter/VerifyProfile";
import PostInternship from "./components/recruiter/PostInternship";
import Applications from "./components/recruiter/Applications";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow mt-16">
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-aadhaar" element={<AadhaarVerification />} />

          {/* Student Dashboard */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/matches" element={<MatchInternshipPage />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<AdminDashboard />}>
            <Route path="recruiter" element={<RecruiterVerified />} />
            <Route path="companies" element={<VerifiedCompanies />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<ReportGeneration />} />
            <Route index element={<RecruiterVerified />} />
          </Route>

          {/* 🔥 Recruiter Dashboard */}
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />}>
            <Route path="verify" element={<VerifyProfile />} />
            <Route path="post" element={<PostInternship />} />
            <Route path="applications" element={<Applications />} />
            {/* Default recruiter route */}
            <Route index element={<VerifyProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;