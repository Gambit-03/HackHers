import { useState } from "react";
import { postInternship } from "../../services/recruiterService";

function PostInternship() {
  const [form, setForm] = useState({
    companyName: "",
    companyId: "",
    role: "",
    domain: "",
    skillsRequired: "",
    stipend: "",
    mode: "",
    duration: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.companyId.trim()) {
      alert("Company name and company ID are required.");
      return;
    }

    try {
      await postInternship({
        ...form,
        companyName: form.companyName.trim(),
        companyId: form.companyId.trim(),
        skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
      });
      alert("Internship Posted");
      setForm({
        companyName: "",
        companyId: "",
        role: "",
        domain: "",
        skillsRequired: "",
        stipend: "",
        mode: "",
        duration: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post internship");
    }
  };

  return (
    <div className="card p-4">
      <h4>Post Internship</h4>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Company Name"
          value={form.companyName}
          onChange={(e) => setForm({...form, companyName: e.target.value})} />
        <input className="form-control mb-2" placeholder="Company ID"
          value={form.companyId}
          onChange={(e) => setForm({...form, companyId: e.target.value})} />
        <input className="form-control mb-2" placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({...form, role: e.target.value})} />
        <input className="form-control mb-2" placeholder="Domain"
          value={form.domain}
          onChange={(e) => setForm({...form, domain: e.target.value})} />
        <input className="form-control mb-2" placeholder="Skills Required (comma separated)"
          value={form.skillsRequired}
          onChange={(e) => setForm({...form, skillsRequired: e.target.value})} />
        <input className="form-control mb-2" placeholder="Stipend"
          value={form.stipend}
          onChange={(e) => setForm({...form, stipend: e.target.value})} />
        <input className="form-control mb-2" placeholder="Mode"
          value={form.mode}
          onChange={(e) => setForm({...form, mode: e.target.value})} />
        <input className="form-control mb-2" placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({...form, duration: e.target.value})} />
        <button className="btn btn-success">Post</button>
      </form>
    </div>
  );
}

export default PostInternship;