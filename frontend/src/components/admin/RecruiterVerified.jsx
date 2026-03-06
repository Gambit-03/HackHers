import { useEffect, useState } from "react";
import { getAdminRecruiters } from "../../services/adminService";

export default function RecruiterVerified() {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    const loadRecruiters = async () => {
      const res = await getAdminRecruiters();
      setRecruiters(res.data || []);
    };

    loadRecruiters();
  }, []);

  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Verified Recruiters</h5>
      {recruiters.map((rec) => (
        <div key={rec.id} className="border p-2 mb-2 rounded">
          <p><strong>Name:</strong> {rec.recruiterName}</p>
          <p><strong>Company:</strong> {rec.companyName} ({rec.companyId})</p>
          <p><strong>Email:</strong> {rec.recruiterEmail}</p>
        </div>
      ))}

      {recruiters.length === 0 && (
        <p className="text-muted mb-0">No verified recruiters found yet.</p>
      )}
    </div>
  );
}