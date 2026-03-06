import { useEffect, useState } from "react";
import { getCompanyCatalog, verifyRecruiter } from "../../services/recruiterService";

function VerifyProfile({ setVerified }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCompanies = async () => {
      const res = await getCompanyCatalog(page, 4);
      setCompanies(res.data.companies || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    };

    loadCompanies();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      alert("Select one company first.");
      return;
    }

    await verifyRecruiter({ companyId: selectedCompany.companyId });
    alert("Verified Successfully");
    setVerified(true);
  };

  return (
    <div className="card p-4">
      <h4>Verify Profile</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          {companies.map((company) => (
            <div key={company.companyId} className="col-md-6">
              <button
                type="button"
                className={`card w-100 text-start p-3 border ${selectedCompany?.companyId === company.companyId ? "border-primary" : "border-light"}`}
                onClick={() => setSelectedCompany(company)}
              >
                <h6 className="mb-1">{company.companyName}</h6>
                <p className="mb-1"><strong>Company ID:</strong> {company.companyId}</p>
                <p className="mb-1"><strong>Industry:</strong> {company.industry}</p>
                <p className="mb-0"><strong>Location:</strong> {company.location}</p>
              </button>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button type="button" className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span className="small text-muted">Page {page} of {totalPages}</span>
          <button type="button" className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>

        <button className="btn btn-primary">Verify</button>
      </form>
    </div>
  );
}

export default VerifyProfile;