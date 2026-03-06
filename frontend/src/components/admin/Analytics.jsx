import { useEffect, useState } from "react";
import { getAdminAnalytics } from "../../services/adminService";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const res = await getAdminAnalytics();
      setStats(res.data);
    };

    loadAnalytics();
  }, []);

  if (!stats) {
    return (
      <div className="card p-3 shadow">
        <h5 className="mb-3">Platform Analytics</h5>
        <p className="text-muted mb-0">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Platform Analytics</h5>
      <p><strong>Current Logged-in Users:</strong> {stats.currentUsers}</p>
      <p><strong>Logged-in Admins:</strong> {stats.loggedInUsersByRole?.admin || 0}</p>
      <p><strong>Logged-in Recruiters:</strong> {stats.loggedInUsersByRole?.recruiter || 0}</p>
      <p><strong>Logged-in Students:</strong> {stats.loggedInUsersByRole?.student || 0}</p>
      <p><strong>Applied Internships:</strong> {stats.appliedInternships}</p>
      <p><strong>Total Internships Available:</strong> {stats.totalInternships}</p>
      <p><strong>Placement Record:</strong> {stats.placedStudents}</p>
    </div>
  );
}