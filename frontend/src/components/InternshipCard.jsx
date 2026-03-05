export default function InternshipCard({ internship, onApply }) {
  return (
    <div className="border p-3 rounded shadow">
      <h5 className="fw-bold">{internship.title}</h5>
      <p><strong>Recruiter:</strong> {internship.recruiter}</p>
      <p><strong>Domain:</strong> {internship.domain}</p>
      <p><strong>Skills:</strong> {internship.skillsRequired.join(", ")}</p>
      <p><strong>Mode:</strong> {internship.mode}</p>
      <p><strong>Term:</strong> {internship.duration}</p>
      <button className="btn btn-primary mt-2" onClick={() => onApply(internship)}>
        Apply
      </button>
    </div>
  );
}