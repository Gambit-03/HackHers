import { useState } from "react";
import { verifyRecruiter } from "../../services/recruiterService";

function VerifyProfile({ setVerified }) {
  const [form, setForm] = useState({
    companyName: "",
    recruiterId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyRecruiter(form);
    alert("Verified Successfully");
    setVerified(true);
  };

  return (
    <div className="card p-4">
      <h4>Verify Profile</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Company Name"
          onChange={(e) =>
            setForm({ ...form, companyName: e.target.value })
          }
        />
        <input
          className="form-control mb-3"
          placeholder="Recruiter ID"
          onChange={(e) =>
            setForm({ ...form, recruiterId: e.target.value })
          }
        />
        <button className="btn btn-primary">Verify</button>
      </form>
    </div>
  );
}

export default VerifyProfile;