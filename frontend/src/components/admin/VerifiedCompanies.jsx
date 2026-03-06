import { useEffect, useState } from "react";
import { getAdminCompanies } from "../../services/adminService";

export default function VerifiedCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      const res = await getAdminCompanies();
      setCompanies(res.data || []);
    };

    loadCompanies();
  }, []);

  const initialsFromCompany = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "NA";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Partnership Companies</h5>
      <div className="d-flex flex-wrap gap-3">
        {companies.map((comp) => (
          <div key={comp.companyId} className="text-center border rounded p-2" style={{ minWidth: "120px" }}>
            <div
              className="mb-2 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: "48px", height: "48px", background: "#2170e2", margin: "0 auto" }}
            >
              {initialsFromCompany(comp.companyName)}
            </div>
            <p className="mb-1 fw-semibold">{comp.companyName}</p>
            <p className="mb-0 small text-muted">{comp.companyId}</p>
          </div>
        ))}

        {companies.length === 0 && (
          <p className="text-muted mb-0">No verified companies yet.</p>
        )}
      </div>
    </div>
  );
}