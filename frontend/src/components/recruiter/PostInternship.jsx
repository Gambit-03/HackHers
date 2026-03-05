import { useState } from "react";
import { postInternship } from "../../services/recruiterService";

function PostInternship() {
  const [form, setForm] = useState({
    role: "",
    skills: "",
    experience: "",
    stipend: "",
    mode: "",
    timePeriod: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postInternship({
      ...form,
      skills: form.skills.split(","),
    });
    alert("Internship Posted");
  };

  return (
    <div className="card p-4">
      <h4>Post Internship</h4>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Role"
          onChange={(e) => setForm({...form, role: e.target.value})} />
        <input className="form-control mb-2" placeholder="Skills (comma separated)"
          onChange={(e) => setForm({...form, skills: e.target.value})} />
        <input className="form-control mb-2" placeholder="Experience"
          onChange={(e) => setForm({...form, experience: e.target.value})} />
        <input className="form-control mb-2" placeholder="Stipend"
          onChange={(e) => setForm({...form, stipend: e.target.value})} />
        <input className="form-control mb-2" placeholder="Mode"
          onChange={(e) => setForm({...form, mode: e.target.value})} />
        <input className="form-control mb-2" placeholder="Time Period"
          onChange={(e) => setForm({...form, timePeriod: e.target.value})} />
        <button className="btn btn-success">Post</button>
      </form>
    </div>
  );
}

export default PostInternship;