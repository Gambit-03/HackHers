import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { FaTimes } from "react-icons/fa";
import RecruiterVerified from "../components/admin/RecruiterVerified";
import VerifiedCompanies from "../components/admin/VerifiedCompanies";
import Analytics from "../components/admin/Analytics";
import ReportGeneration from "../components/admin/ReportGeneration";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("recruiter");
  const [showContent, setShowContent] = useState(true);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <AdminHeader />

      {/* Navbar */}
      <div className="d-flex justify-content-center mt-3 gap-4">
        <button className={`btn ${activeTab === 'recruiter' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('recruiter')}>Recruiter Verified</button>
        <button className={`btn ${activeTab === 'companies' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('companies')}>Verified Companies</button>
        <button className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
        <button className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('reports')}>Report Generation</button>
      </div>

      {/* Content Card */}
      {showContent && (
        <div className="position-relative mt-4 p-3">
          {/* Close button */}
          <button
            className="btn position-absolute top-0 end-0 m-2 p-1 border-0 bg-transparent text-danger"
            onClick={() => setShowContent(false)}
          >
            <FaTimes size={22} />
          </button>

          {/* Dynamic Content */}
          {activeTab === 'recruiter' && <RecruiterVerified />}
          {activeTab === 'companies' && <VerifiedCompanies />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'reports' && <ReportGeneration />}
        </div>
      )}
    </div>
  );
}