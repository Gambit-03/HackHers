import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../services/authService";

function AadhaarVerification() {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // ... (inside AadhaarVerification component)

  const token = getAuthToken(); // JWT token from current tab session
  console.log("Current token:", token); // Add this

  // Send OTP handler
  const sendOtpHandler = async () => {
    setMessage("");
    setError("");
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setError("Enter a valid 12-digit Aadhaar number");
      return;
    }
    console.log("Sending OTP for Aadhaar:", aadhaarNumber); // Add this
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/send-aadhaar-otp",
        { aadhaarNumber },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Send OTP response:", res.data); // Add this
      setMessage(res.data.message);
      setOtpSent(true);
    } catch (err) {
      console.error("Send OTP error:", err.response?.data || err.message); // Add this
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP handler
  const verifyOtpHandler = async () => {
    setMessage("");
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP");
      return;
    }
    console.log("Verifying OTP:", otp); // Add this
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-aadhaar-otp",
        { otp },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Verify OTP response:", res.data); // Add this
      setMessage(res.data.message);
      // Redirect based on role
      navigate(`/dashboard/${res.data.role}`);
    } catch (err) {
      console.error("Verify OTP error:", err.response?.data || err.message); // Add this
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  // ...

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white py-3 text-center">
        <h2>PM Internship Scheme</h2>
      </header>

      {/* Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <h3 className="text-center text-primary fw-bold mb-4">
            Aadhaar Verification
          </h3>

          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}
          {message && (
            <div className="alert alert-success text-center py-2">
              {message}
            </div>
          )}

          {/* Aadhaar Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Aadhaar Number</label>
            <input
              type="text"
              className="form-control"
              maxLength={12}
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mb-4">
            <button
              type="button"
              className="btn btn-primary fw-semibold"
              onClick={sendOtpHandler}
            >
              Send OTP
            </button>
          </div>

          {/* OTP Field */}
          {otpSent && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="d-grid gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-success fw-semibold"
                  onClick={verifyOtpHandler}
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        © 2026 PM Internship Scheme | Government of India
      </footer>
    </div>
  );
}

export default AadhaarVerification;
