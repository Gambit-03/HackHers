import { useLocation } from "react-router-dom";
import { useState } from "react";
import InternshipCard from "../components/InternshipCard";
import axios from "axios";

export default function MatchInternshipPage({ student }) {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };

  // State to remove applied internships from the UI
  const [internships, setInternships] = useState(recommendations);

  const handleApply = async (internship) => {
    try {
      // 1️⃣ Show alert
      alert(`Applied to ${internship.title}`);

      // 2️⃣ Remove internship from UI
      setInternships(prev => prev.filter(item => item.title !== internship.title));

      // 3️⃣ Save to database
      await axios.post("/api/appliedInternships", {
        studentId: student.id,     // or student._id
        internshipId: internship.title, // or a unique id if you have it
      });

    } catch (error) {
      console.error("Error applying:", error);
      alert("Something went wrong while applying. Try again!");
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