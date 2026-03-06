import { useEffect, useState } from "react";
import {
  extendOffer,
  getApplications,
  updateApplicationStatus,
} from "../../services/recruiterService";

function Applications() {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    pendingReview: 0,
    shortlistedOrInterviewing: 0,
    rejected: 0,
    offerExtended: 0,
    hired: 0,
    declinedByStudent: 0,
    offerAcceptanceRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [offerForm, setOfferForm] = useState({
    startDate: "",
    endDate: "",
    stipendAmount: "",
    mode: "remote",
    offerLetter: null,
  });
  const [filters, setFilters] = useState({
    minScore: "",
    status: "",
    location: "",
    educationLevel: "",
    skill: "",
    search: "",
  });

  useEffect(() => {
    fetchApps();
  }, [filters]);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await getApplications(filters);
      setData(res.data.applications || []);
      setMetrics(res.data.metrics || {
        totalApplications: 0,
        pendingReview: 0,
        shortlistedOrInterviewing: 0,
        rejected: 0,
        offerExtended: 0,
        hired: 0,
        declinedByStudent: 0,
        offerAcceptanceRate: 0,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const metricCard = (label, value, variant) => (
    <div className="col-md-3" key={label}>
      <div className={`card shadow-sm border-${variant}`}>
        <div className="card-body">
          <p className="mb-1 text-muted small">{label}</p>
          <h4 className="mb-0">{value}</h4>
        </div>
      </div>
    </div>
  );

  const badgeClassByStatus = {
    pending: "bg-secondary",
    reviewed: "bg-info text-dark",
    shortlisted: "bg-primary",
    interviewing: "bg-warning text-dark",
    rejected: "bg-danger",
    offer_extended: "bg-success",
    hired: "bg-success",
    declined_by_student: "bg-dark",
    offer_received: "bg-success",
  };

  const openOfferModal = (application) => {
    setSelectedApplication(application);
    setOfferForm({
      startDate: "",
      endDate: "",
      stipendAmount: "",
      mode: application.internshipId?.mode || "remote",
      offerLetter: null,
    });
    setShowOfferModal(true);
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    try {
      const formData = new FormData();
      formData.append("startDate", offerForm.startDate);
      formData.append("endDate", offerForm.endDate);
      formData.append("stipendAmount", offerForm.stipendAmount);
      formData.append("mode", offerForm.mode);

      if (offerForm.offerLetter) {
        formData.append("offerLetter", offerForm.offerLetter);
      }

      await extendOffer(selectedApplication._id, formData);
      setShowOfferModal(false);
      setSelectedApplication(null);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to extend offer");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">Applications Dashboard</h4>

      <div className="row g-3 mb-4">
        {metricCard("Total Applications", metrics.totalApplications, "dark")}
        {metricCard("Pending Review", metrics.pendingReview, "secondary")}
        {metricCard("Shortlisted / Interviewing", metrics.shortlistedOrInterviewing, "primary")}
        {metricCard("Rejected", metrics.rejected, "danger")}
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span className="fw-semibold me-2">Offer History</span>
        <button
          type="button"
          className={`btn btn-sm ${filters.status === "offer_extended" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "offer_extended" }))}
        >
          Offer Extended ({metrics.offerExtended})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filters.status === "hired" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "hired" }))}
        >
          Hired ({metrics.hired})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${filters.status === "declined_by_student" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setFilters((prev) => ({ ...prev, status: "declined_by_student" }))}
        >
          Declined ({metrics.declinedByStudent})
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setFilters((prev) => ({ ...prev, status: "" }))}
        >
          Clear
        </button>
        <span className="badge bg-info text-dark ms-auto">
          Offer Acceptance: {metrics.offerAcceptanceRate}%
        </span>
      </div>

      <div className="border rounded p-3 mb-4 bg-light">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search by applicant name or email"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              min={0}
              max={100}
              placeholder="Min AI score"
              value={filters.minScore}
              onChange={(e) => setFilters((prev) => ({ ...prev, minScore: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer_extended">Offer Extended</option>
              <option value="hired">Hired</option>
              <option value="declined_by_student">Declined by Student</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Education"
              value={filters.educationLevel}
              onChange={(e) => setFilters((prev) => ({ ...prev, educationLevel: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Skill"
              value={filters.skill}
              onChange={(e) => setFilters((prev) => ({ ...prev, skill: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => setFilters({
                minScore: "",
                status: "",
                location: "",
                educationLevel: "",
                skill: "",
                search: "",
              })}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading && <p className="mb-0">Loading applications...</p>}

      {!loading && data.length === 0 && (
        <p className="text-muted mb-0">No applications found for the selected filters.</p>
      )}

      {!loading && data.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Internship</th>
                <th>Company</th>
                <th>AI Match</th>
                <th>Status</th>
                <th>Location</th>
                <th>Education</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((application) => (
                <tr key={application._id}>
                  <td>
                    <div className="fw-semibold">{application.applicantName}</div>
                    <div className="text-muted small">{application.applicantEmail}</div>
                  </td>
                  <td>{application.internshipTitle}</td>
                  <td>{application.companyName} ({application.companyId})</td>
                  <td>{application.aiMatchScore}%</td>
                  <td>
                    <span className={`badge ${badgeClassByStatus[application.status] || "bg-secondary"}`}>
                      {application.status}
                    </span>
                  </td>
                  <td>{application.location || "-"}</td>
                  <td>{application.educationLevel || "-"}</td>
                  <td>{application.skills?.join(", ") || "-"}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleStatusUpdate(application._id, "reviewed")}
                      >
                        Review
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleStatusUpdate(application._id, "shortlisted")}
                      >
                        Shortlist
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleStatusUpdate(application._id, "interviewing")}
                      >
                        Interview
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleStatusUpdate(application._id, "rejected")}
                      >
                        Reject
                      </button>
                      {application.status === "shortlisted" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => openOfferModal(application)}
                        >
                          Extend Offer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showOfferModal && selectedApplication && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.45)", zIndex: 2000 }}
        >
          <div className="card shadow" style={{ width: "100%", maxWidth: "560px" }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Extend Offer</h5>
              <p className="small text-muted mb-3">
                {selectedApplication.applicantName} - {selectedApplication.internshipTitle} at {selectedApplication.companyName}
              </p>

              <form onSubmit={submitOffer}>
                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={offerForm.startDate}
                      onChange={(e) => setOfferForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={offerForm.endDate}
                      onChange={(e) => setOfferForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label">Stipend Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. INR 25,000/month"
                    value={offerForm.stipendAmount}
                    onChange={(e) => setOfferForm((prev) => ({ ...prev, stipendAmount: e.target.value }))}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Mode</label>
                  <select
                    className="form-select"
                    required
                    value={offerForm.mode}
                    onChange={(e) => setOfferForm((prev) => ({ ...prev, mode: e.target.value }))}
                  >
                    <option value="remote">Remote</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Offer Letter (PDF)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control"
                    onChange={(e) => setOfferForm((prev) => ({ ...prev, offerLetter: e.target.files?.[0] || null }))}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowOfferModal(false);
                      setSelectedApplication(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">Extend Offer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;