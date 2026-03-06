import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  // ✅ Initialize all fields
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    // ✅ Check password confirmation
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    // ✅ Prepare payload for backend
    const payload = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      dob: form.dob,
      role: form.role,
      password: form.password
    };

    console.log("Submitting payload:", payload); // Debug payload

    try {
      setLoading(true);
      await registerUser(payload); // Call backend
      setLoading(false);
      navigate("/login"); // Redirect on success
    } catch (err) {
      setLoading(false);
      // ✅ Show backend error message if exists
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="bg-light min-vh-100">

      {/* 🔵 Government Header */}
      <div className="bg-primary text-white text-center py-3">
        <small className="fw-semibold">
          PM Internship Scheme | Government of India
        </small>
      </div>

      {/* 🔵 Navbar */}
      <div className="my-3">
        <Navbar />
      </div>

      {/* 🔵 Form Container */}
      <div className="container mt-5 mb-5 d-flex justify-content-center">
        <div
          className="card shadow-lg p-4 border-0"
          style={{ width: "100%", maxWidth: "500px", borderRadius: "12px" }}
        >
          <h3 className="text-center mb-4 text-primary fw-bold">
            Create Account
          </h3>

          {/* 🔴 Error Message */}
          {error && (
            <div className="alert alert-danger text-center py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Full Name</label>
              <input
                type="text"
                className="form-control py-2"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Mobile */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Mobile Number</label>
              <input
                type="text"
                className="form-control py-2"
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="form-control py-2"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* DOB */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                className="form-control py-2"
                required
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">I am</label>
              <select
                className="form-select py-2"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold mb-2">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control py-2"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control py-2"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold py-2"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

          </form>
        </div>
      </div>

      {/* 🔵 Footer */}
      <footer className="bg-primary text-white text-center py-3">
        © 2026 PM Internship Scheme | Government of India
      </footer>

    </div>
  );
}

export default Register;