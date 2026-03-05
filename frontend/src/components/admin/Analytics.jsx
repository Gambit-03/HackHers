// Dummy stats
const stats = {
  currentUsers: 120,
  appliedInternships: 85,
  totalInternships: 50,
  placedStudents: 25
};

export default function Analytics() {
  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Platform Analytics</h5>
      <p><strong>Current Logged-in Users:</strong> {stats.currentUsers}</p>
      <p><strong>Applied Internships:</strong> {stats.appliedInternships}</p>
      <p><strong>Total Internships Available:</strong> {stats.totalInternships}</p>
      <p><strong>Placement Record:</strong> {stats.placedStudents}</p>
    </div>
  );
}