import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { FaUserCog, FaUser, FaFileAlt, FaClipboardList, FaAward, FaArrowRight } from "react-icons/fa";

export default function SNavbar({ student }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4 py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="fw-bold fs-5">Student Dashboard</span>

          {/* Features with arrows */}
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3"><FaUser /> <span className="ms-1">Registered</span></div>
            <FaArrowRight className="text-secondary me-3" />
            <div className="d-flex align-items-center me-3"><FaUser /> <span className="ms-1">Profile</span></div>
            <FaArrowRight className="text-secondary me-3" />
            <div className="d-flex align-items-center me-3"><FaFileAlt /> <span className="ms-1">Application</span></div>
            <FaArrowRight className="text-secondary me-3" />
            <div className="d-flex align-items-center"><FaAward /> <span className="ms-1">Offer</span></div>
          </div>

          {/* Profile Settings Icon */}
          <button
            className="btn p-0 border-0"
            onClick={() => setShowProfile(true)}
          >
            <FaUserCog size={28} />
          </button>
        </div>
      </nav>

      {/* Profile Card Modal */}
      {showProfile && (
        <ProfileCard
          student={student}
          onClose={() => setShowProfile(false)} // <-- parent handles hide
        />
      )}

      {/* Main Dashboard Content */}
      <div className="p-4">
        <h3>Welcome, {student.name}</h3>
        <p>This is your dashboard content. Click the settings icon to view profile.</p>
      </div>
    </div>
  );
}