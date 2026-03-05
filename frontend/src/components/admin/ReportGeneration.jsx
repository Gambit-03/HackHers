import axios from "axios";

const dummyReports = [
  { name: "Internship Applications", id: 1 },
  { name: "Placement Summary", id: 2 },
];

export default function ReportGeneration() {
  const handleDownload = async (report) => {
    try {
      // Replace with your API endpoint to generate/download PDF
      const res = await axios.get(`/api/reports/${report.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.name}.pdf`);
      document.body.appendChild(link);
      link.click();
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