import { useTranslation } from "react-i18next";
import {
  FaUserGraduate,
  FaBriefcase,
  FaRupeeSign,
  FaIndustry,
  FaIdCard
} from "react-icons/fa";
import Navbar from "../components/Navbar";

function Home() {
  const { t } = useTranslation();

  const eligibility = [
    { text: "Age between 21–24 years", icon: <FaUserGraduate /> },
    { text: "Not in full-time employment", icon: <FaBriefcase /> },
    { text: "Annual family income below ₹8 lakh", icon: <FaRupeeSign /> },
    { text: "Industry exposure interest", icon: <FaIndustry /> },
    { text: "Valid Aadhaar required", icon: <FaIdCard /> }
  ];

  const benefits = [
    { text: "12-month internship program", icon: <FaBriefcase /> },
    { text: "₹4500 monthly stipend", icon: <FaRupeeSign /> },
    { text: "₹6000 one-time allowance", icon: <FaRupeeSign /> },
    { text: "Practical industry experience", icon: <FaIndustry /> },
    { text: "Skill development training", icon: <FaUserGraduate /> }
  ];

  return (
    <div className="bg-light">

      {/* 🔵 Top Government Header */}
      <div className="bg-primary text-white text-center py-3">
        <small className="fw-semibold">
          PM Internship Scheme | Government of India
        </small>
      </div>

      {/* 🔵 Gap Between Header & Navbar */}
      <div className="my-3">
        <Navbar />
      </div>

      {/* 🔵 Main Content with Gap */}
      <div className="container mt-5">

        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary mb-3">
            {t("home.heroTitle")}
          </h1>
          <p className="lead text-muted">
            {t("home.heroSub")}
          </p>
        </div>

        {/* Eligibility Section */}
        <h2 className="text-center fw-bold mb-4">
          {t("home.eligibility")}
        </h2>

        <div className="row g-4 mb-5">
          {eligibility.map((item, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm text-center p-4 border-0">
                <div className="display-4 text-primary mb-3">
                  {item.icon}
                </div>
                <p className="fw-semibold">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <h2 className="text-center fw-bold mb-4">
          {t("home.benefits")}
        </h2>

        <div className="row g-4">
          {benefits.map((item, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm text-center p-4 border-0">
                <div className="display-4 text-success mb-3">
                  {item.icon}
                </div>
                <p className="fw-semibold">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🔵 Footer */}
      <footer className="bg-primary text-white text-center py-4 mt-5">
        © 2026 PM Internship Scheme | Government of India
      </footer>

    </div>
  );
}

export default Home;