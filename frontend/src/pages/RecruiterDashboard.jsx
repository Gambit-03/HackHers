import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";
import VerifyProfile from "../components/recruiter/VerifyProfile";
import PostInternship from "../components/recruiter/PostInternship";
import Applications from "../components/recruiter/Applications";
import { clearAuthToken, getCurrentUser } from "../services/authService";
import { getRecruiterProfile } from "../services/recruiterService";

function RecruiterDashboard() {
  const [active, setActive] = useState("verify");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data.user?.role !== "recruiter") {
          navigate(`/dashboard/${res.data.user?.role || "student"}`);
          return;
        }
        setUser(res.data.user);
        const recruiterRes = await getRecruiterProfile();
        setVerified(Boolean(recruiterRes.data.recruiter?.isVerified));
      } catch (err) {
        clearAuthToken();
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  return (
    <div>
      <h2 className="text-center mt-3">PM Internship Scheme - Recruiter</h2>
      <p className="text-center mb-3">
        Welcome{user?.name ? `, ${user.name}` : ""}
      </p>

      <RecruiterNavbar
        verified={verified}
        setActive={setActive}
      />

      <div className="container mt-4">
        {active === "verify" && (
          <VerifyProfile setVerified={setVerified} />
        )}
        {active === "post" && verified && <PostInternship />}
        {active === "applications" && verified && <Applications />}
      </div>
    </div>
  );
}

export default RecruiterDashboard;