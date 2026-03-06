import { useState } from "react";
import axios from "axios";
import { getAuthToken } from "../services/authService";

export default function DashboardContent({ student, onRecommendationsLoaded }) {
  const [form, setForm] = useState({
    domain: "",
    skills: "",
    mode: "remote",
    duration: "",
    experienceLevel: "fresher",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const token = getAuthToken();
      const res = await axios.post(
        "http://localhost:5000/api/students/recommend",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const top5 = res.data.topInternships || [];
      onRecommendationsLoaded?.(top5, form);

    } catch (error) {
      console.error("ERROR OCCURRED:", error);
      alert("Something went wrong while processing recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="p-3 bg-light rounded shadow" onSubmit={handleSubmit}>
      <input
        name="domain"
        placeholder="Domain"
        value={form.domain}
        onChange={handleChange}
        className="form-control mb-2"
      />

      <input
        name="skills"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={handleChange}
        className="form-control mb-2"
      />

      <select
        name="mode"
        value={form.mode}
        onChange={handleChange}
        className="form-select mb-2"
      >
        <option value="remote">Remote</option>
        <option value="offline">Offline</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <input
        name="duration"
        placeholder="Duration"
        value={form.duration}
        onChange={handleChange}
        className="form-control mb-2"
      />

      <select
        name="experienceLevel"
        value={form.experienceLevel}
        onChange={handleChange}
        className="form-select mb-2"
      >
        <option value="fresher">Fresher</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
        {isLoading ? "Finding internships..." : "Get Recommendations"}
      </button>
    </form>
  );
}