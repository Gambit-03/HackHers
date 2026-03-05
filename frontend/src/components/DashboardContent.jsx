import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardContent({ student }) {
  const [form, setForm] = useState({
    domain: "",
    skills: "",
    mode: "remote",
    duration: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const normalize = (value) =>
    value?.toString().trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("==== USER FORM DATA ====");
    console.log(form);

    const studentSkills = form.skills
      .split(",")
      .map(s => normalize(s));

    console.log("Normalized Student Skills:", studentSkills);

    const studentDomain = normalize(form.domain);
    const studentMode = normalize(form.mode);
    const studentDuration = normalize(form.duration);

    try {
      console.log("Fetching internships from DB...");
      const res = await axios.get("http://localhost:5000/api/internships");

      const internships = res.data;

      console.log("Internships fetched from DB:", internships);

      const rankedInternships = internships.map((intern) => {
        console.log("------------");
        console.log("Checking Internship:", intern.title);

        let score = 0;

        const internDomain = normalize(intern.domain);
        const internMode = normalize(intern.mode);
        const internDuration = normalize(intern.duration);
        const internSkills = intern.skillsRequired.map(s =>
          normalize(s)
        );

        console.log("Intern Domain:", internDomain);
        console.log("Intern Mode:", internMode);
        console.log("Intern Duration:", internDuration);
        console.log("Intern Skills:", internSkills);

        // 🔥 Domain Match (30 points)
        if (internDomain === studentDomain) {
          score += 30;
          console.log("Domain matched +30");
        }

        // 🔥 Mode Match (20 points)
        if (internMode === studentMode) {
          score += 20;
          console.log("Mode matched +20");
        }

        // 🔥 Duration Match (15 points)
        if (internDuration === studentDuration) {
          score += 15;
          console.log("Duration matched +15");
        }

        // 🔥 Skills Match (10 per skill)
        const matchedSkills = internSkills.filter(skill =>
          studentSkills.includes(skill)
        );

        score += matchedSkills.length * 10;

        console.log("Matched Skills:", matchedSkills);
        console.log("Skills Score:", matchedSkills.length * 10);
        console.log("Final Score:", score);

        return {
          ...intern,
          score
        };
      });

      console.log("Before Sorting:", rankedInternships);

      rankedInternships.sort((a, b) => b.score - a.score);

      console.log("After Sorting:", rankedInternships);

      const top5 = rankedInternships.slice(0, 5);

      console.log("TOP 5 INTERNSHIPS:", top5);

      navigate("/dashboard/matches", {
        state: { recommendations: top5 }
      });

    } catch (error) {
      console.error("ERROR OCCURRED:", error);
      alert("Something went wrong while processing recommendations.");
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

      <button type="submit" className="btn btn-primary w-100">
        Get Recommendations
      </button>
    </form>
  );
}