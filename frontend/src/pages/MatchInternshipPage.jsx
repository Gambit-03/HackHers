import { useLocation } from "react-router-dom";
import { useState } from "react";
import InternshipCard from "../components/InternshipCard";
import axios from "axios";
import { getAuthToken } from "../services/authService";

export default function MatchInternshipPage() {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };

  // State to remove applied internships from the UI
  const [internships, setInternships] = useState(recommendations);

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

      alert(`Applied to ${internship.title}`);
      setInternships(prev => prev.filter(item => item.title !== internship.title));

    } catch (error) {
      console.error("Error applying:", error);
      alert(error.response?.data?.message || "Something went wrong while applying. Try again!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Matched Internships</h1>

      {internships.length === 0 ? (
        <p>No internships available or all applied.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship, idx) => (
            <InternshipCard
              key={idx}
              internship={internship}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}