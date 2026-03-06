import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SHeader from "../components/SHeader";
import SNavbar from "../components/SNavbar";
import DashboardContent from "../components/DashboardContent";
import InternshipCard from "../components/InternshipCard";
import { clearAuthToken, getAuthToken, getCurrentUser } from "../services/authService";

const API_BASE = "http://localhost:5000";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [offers, setOffers] = useState([]);
  const [pendingOfferCount, setPendingOfferCount] = useState(0);
  const [latestPendingOffer, setLatestPendingOffer] = useState(null);
  const navigate = useNavigate();

  const fetchOffers = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE}/api/students/offers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers || []);
      setPendingOfferCount(res.data.pendingOfferCount || 0);
      setLatestPendingOffer(res.data.latestPendingOffer || null);
    } catch (error) {
      // Ignore noisy fetch failures on transient reloads.
    }
  };

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data.user?.role !== "student") {
          navigate(`/dashboard/${res.data.user?.role || "login"}`);
          return;
        }
        setStudent(res.data.user);
        fetchOffers();
      } catch (err) {
        clearAuthToken();
        navigate("/login");
      }
    };

    loadStudent();
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOffers();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  if (!student) {
    return (
      <div>
        <SHeader />
        <div className="p-4">Loading profile...</div>
      </div>
    );
  }

  const handleRecommendationsLoaded = (items = []) => {
    setRecommendations(items);
    setHasSearched(true);
  };

  const handleApply = async (internship) => {
    try {
      const token = getAuthToken();
      await axios.post(
        "http://localhost:5000/api/students/apply",
        {
          internshipTitle: internship.title,
          companyName: internship.company,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Applied to ${internship.title} at ${internship.company}`);
      setRecommendations((prev) => prev.filter((item) => item.id !== internship.id));
    } catch (error) {
      alert(error.response?.data?.message || "Unable to apply right now.");
    }
  };

  const respondToOffer = async (offerId, decision) => {
    try {
      const token = getAuthToken();
      await axios.patch(
        `${API_BASE}/api/students/offers/${offerId}/respond`,
        { decision },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchOffers();
      alert(decision === "accept" ? "Offer accepted successfully" : "Offer declined");
    } catch (error) {
      alert(error.response?.data?.message || "Could not process your decision");
    }
  };

  return (
    <div>
      <SHeader />
      <SNavbar student={student} onProfileUpdated={setStudent} pendingOfferCount={pendingOfferCount} />
      <div className="container my-3">
        {latestPendingOffer && (
          <div className="alert alert-success d-flex justify-content-between align-items-center">
            <div>
              <strong>Congratulations!</strong> You have received an offer from {latestPendingOffer.companyName}.
            </div>
            <span className="badge bg-success">Action Required</span>
          </div>
        )}

        <DashboardContent student={student} onRecommendationsLoaded={handleRecommendationsLoaded} />

        {hasSearched && (
          <div className="mt-4">
            <h4 className="mb-3">Recommended Internships</h4>

            {recommendations.length === 0 ? (
              <p className="text-muted">No internships matched your criteria. Try broader filters or different skills.</p>
            ) : (
              <div className="row g-3">
                {recommendations.map((internship) => (
                  <div className="col-12" key={internship.id}>
                    <div className="card p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary">Rank #{internship.rank}</span>
                        <span className="badge bg-success">Score {internship.totalScore}%</span>
                      </div>
                      <InternshipCard internship={internship} onApply={handleApply} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <h4 className="mb-3">Offers</h4>
          {offers.length === 0 ? (
            <p className="text-muted">No offers received yet.</p>
          ) : (
            <div className="row g-3">
              {offers.map((offer) => {
                const offerLetterUrl = offer.offerDetails?.offerLetterPath
                  ? `${API_BASE}${offer.offerDetails.offerLetterPath}`
                  : null;

                return (
                  <div className="col-12" key={offer.id}>
                    <div className="card shadow-sm p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{offer.companyName} - {offer.role}</h5>
                        <span className={`badge ${offer.status === "hired" ? "bg-success" : "bg-primary"}`}>
                          {offer.status}
                        </span>
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-md-3"><strong>Start:</strong> {offer.offerDetails?.startDate ? new Date(offer.offerDetails.startDate).toLocaleDateString() : "-"}</div>
                        <div className="col-md-3"><strong>End:</strong> {offer.offerDetails?.endDate ? new Date(offer.offerDetails.endDate).toLocaleDateString() : "-"}</div>
                        <div className="col-md-3"><strong>Stipend:</strong> {offer.offerDetails?.stipendAmount || "-"}</div>
                        <div className="col-md-3"><strong>Mode:</strong> {offer.offerDetails?.mode || "-"}</div>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {offerLetterUrl && (
                          <a
                            className="btn btn-outline-primary btn-sm"
                            href={offerLetterUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Download Offer Letter
                          </a>
                        )}

                        {offer.status === "offer_extended" && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => respondToOffer(offer.id, "accept")}
                            >
                              Accept Offer
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => respondToOffer(offer.id, "decline")}
                            >
                              Decline Offer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}