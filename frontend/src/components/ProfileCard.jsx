import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  clearAuthToken,
  logoutUser,
  updateCurrentUser,
} from "../services/authService";

export default function ProfileCard({ student, onClose, onProfileUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: student.name || "",
    dob: student.dob || "",
    place: student.profileDetails?.place || "",
    resume: null,
    domain: student.profile?.domain || "",
    experience: student.profileDetails?.experience || "",
    mode: student.profile?.availability || "remote",
    fulltime: student.profileDetails?.fulltime || false,
    email: student.email || "",
    degree: student.profileDetails?.degree || "",
    college: student.profileDetails?.college || "",
    year: student.profileDetails?.year || "",
    cgpa: student.profileDetails?.cgpa || "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      fullname: student?.name || "",
      dob: student?.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      email: student?.email || "",
      place: student?.profileDetails?.place || "",
      domain: student?.profile?.domain || "",
      experience: student?.profileDetails?.experience || "",
      mode: student?.profile?.availability || prev.mode,
      fulltime: student?.profileDetails?.fulltime || false,
      degree: student?.profileDetails?.degree || "",
      college: student?.profileDetails?.college || "",
      year: student?.profileDetails?.year || "",
      cgpa: student?.profileDetails?.cgpa || "",
      resume: student?.profileDetails?.resumeName
        ? { name: student.profileDetails.resumeName }
        : null,
    }));
  }, [student]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProfileData({ ...profileData, [name]: checked });
    } else if (type === "file") {
      setProfileData({ ...profileData, [name]: files[0] });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const payload = {
        fullname: profileData.fullname,
        dob: profileData.dob,
        email: profileData.email,
        domain: profileData.domain,
        mode: profileData.mode,
        profileDetails: {
          place: profileData.place,
          experience: profileData.experience,
          fulltime: profileData.fulltime,
          degree: profileData.degree,
          college: profileData.college,
          year: profileData.year,
          cgpa: profileData.cgpa,
          resumeName: profileData.resume?.name || "",
        },
      };

      const res = await updateCurrentUser(payload);
      onProfileUpdated?.(res.data.user);
      setShowEdit(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded shadow position-relative" style={{ width: '600px', maxWidth: '95%', maxHeight: '90%', overflowY: 'auto' }}>
        {/* Close Button */}
        <button
          className="btn position-absolute top-0 end-0 m-2 p-1 border-0 bg-transparent text-danger"
          onClick={onClose}
        >
          <FaTimes size={22} />
        </button>

        {!showEdit ? (
          // VIEW MODE
          <div>
            <h5 className="fw-bold mb-3">Profile Details</h5>
            <p><strong>Full Name:</strong> {profileData.fullname}</p>
            <p><strong>Date of Birth:</strong> {profileData.dob}</p>
            <p><strong>Place:</strong> {profileData.place}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Domain:</strong> {profileData.domain}</p>
            <p><strong>Experience:</strong> {profileData.experience}</p>
            <p><strong>Mode:</strong> {profileData.mode}</p>
            <p><strong>Full Time:</strong> {profileData.fulltime ? "Yes" : "No"}</p>
            <p><strong>Degree:</strong> {profileData.degree}</p>
            <p><strong>College:</strong> {profileData.college}</p>
            <p><strong>Year of Passing:</strong> {profileData.year}</p>
            <p><strong>CGPA:</strong> {profileData.cgpa}</p>
            <p><strong>Resume:</strong> {profileData.resume ? profileData.resume.name : "Not uploaded"}</p>

            <div className="mt-3 d-flex justify-content-between">
              <button className="btn btn-primary" onClick={() => setShowEdit(true)}>Edit Profile</button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  try {
                    await logoutUser();
                  } catch (err) {
                    // Continue local cleanup even if backend logout fails.
                  }
                  clearAuthToken();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Edit Profile</h5>

            <input type="text" name="fullname" placeholder="Full Name" className="form-control mb-2" value={profileData.fullname} onChange={handleChange} required />
            <input type="date" name="dob" placeholder="Date of Birth" className="form-control mb-2" value={profileData.dob} onChange={handleChange} required />
            <input type="text" name="place" placeholder="Place" className="form-control mb-2" value={profileData.place} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="form-control mb-2" value={profileData.email} onChange={handleChange} required />
            <input type="text" name="domain" placeholder="Domain" className="form-control mb-2" value={profileData.domain} onChange={handleChange} />
            <input type="text" name="experience" placeholder="Experience" className="form-control mb-2" value={profileData.experience} onChange={handleChange} />
            <select name="mode" className="form-select mb-2" value={profileData.mode} onChange={handleChange}>
              <option value="remote">Remote</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" name="fulltime" checked={profileData.fulltime} onChange={handleChange} />
              <label className="form-check-label">Full Time</label>
            </div>
            <input type="text" name="degree" placeholder="Degree" className="form-control mb-2" value={profileData.degree} onChange={handleChange} />
            <input type="text" name="college" placeholder="College Name" className="form-control mb-2" value={profileData.college} onChange={handleChange} />
            <input type="text" name="year" placeholder="Year of Passing" className="form-control mb-2" value={profileData.year} onChange={handleChange} />
            <input type="text" name="cgpa" placeholder="CGPA" className="form-control mb-2" value={profileData.cgpa} onChange={handleChange} />
            <input type="file" name="resume" className="form-control mb-3" onChange={handleChange} />

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}