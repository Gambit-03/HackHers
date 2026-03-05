import { useState } from "react";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";
import VerifyProfile from "../components/recruiter/VerifyProfile";
import PostInternship from "../components/recruiter/PostInternship";
import Applications from "../components/recruiter/Applications";

function RecruiterDashboard() {
  const [active, setActive] = useState("verify");
  const [verified, setVerified] = useState(false);

  return (
    <div>
      <h2 className="text-center mt-3">PM Internship Scheme - Recruiter</h2>

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