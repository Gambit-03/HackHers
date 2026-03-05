const dummyRecruiters = [
  { name: "John Doe", company: "ABC Corp", email: "john@abc.com" },
  { name: "Jane Smith", company: "XYZ Pvt Ltd", email: "jane@xyz.com" },
];

export default function RecruiterVerified() {
  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Verified Recruiters</h5>
      {dummyRecruiters.map((rec, idx) => (
        <div key={idx} className="border p-2 mb-2 rounded">
          <p><strong>Name:</strong> {rec.name}</p>
          <p><strong>Company:</strong> {rec.company}</p>
          <p><strong>Email:</strong> {rec.email}</p>
        </div>
      ))}
    </div>
  );
}