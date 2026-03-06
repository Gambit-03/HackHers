import { downloadAdminReport } from "../../services/adminService";

const dummyReports = [
  {
    name: "Internship Applications",
    id: "internship-applications",
    fileName: "internship-applications-report.pdf",
  },
  {
    name: "Placement Summary",
    id: "placement-summary",
    fileName: "placement-summary-report.pdf",
  },
];

export default function ReportGeneration() {
  const handleDownload = async (report) => {
    try {
      const res = await downloadAdminReport(report.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report", error);
      alert("Failed to download report");
    }
  };

  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Reports</h5>
      {dummyReports.map((rep) => (
        <div key={rep.id} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded">
          <span>{rep.name}</span>
          <button className="btn btn-primary btn-sm" onClick={() => handleDownload(rep)}>Download PDF</button>
        </div>
      ))}
    </div>
  );
}