export default function InternshipCard({ internship, onApply }) {
  const skills = Array.isArray(internship.skillsRequired) ? internship.skillsRequired : [];

  return (
    <div className="border p-3 rounded bg-white">
      <h5 className="fw-bold">{internship.title}</h5>
      <p><strong>Company:</strong> {internship.company}</p>
      {internship.companyId && <p><strong>Company ID:</strong> {internship.companyId}</p>}
      <p><strong>Domain:</strong> {internship.domain}</p>
      <p><strong>Skills:</strong> {skills.join(", ") || "-"}</p>
      <p><strong>Mode:</strong> {internship.availability || internship.mode}</p>
      <p><strong>Duration:</strong> {internship.duration}</p>
      <p><strong>Match Score:</strong> {internship.totalScore ?? internship.score}</p>
      {internship.criteriaScores && (
        <p className="text-muted mb-2">
          Domain: {internship.criteriaScores.domain} | Skills: {internship.criteriaScores.skills} | Mode: {internship.criteriaScores.availability} | Duration: {internship.criteriaScores.duration}
        </p>
      )}
      <button className="btn btn-primary mt-2" onClick={() => onApply(internship)}>
        Apply
      </button>
    </div>
  );
}