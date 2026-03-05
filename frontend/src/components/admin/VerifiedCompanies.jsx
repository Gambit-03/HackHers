const dummyCompanies = [
  { name: "ABC Corp", logo: "https://via.placeholder.com/50" },
  { name: "XYZ Pvt Ltd", logo: "https://via.placeholder.com/50" },
  { name: "Data Corp", logo: "https://via.placeholder.com/50" },
];

export default function VerifiedCompanies() {
  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Partnership Companies</h5>
      <div className="d-flex flex-wrap gap-3">
        {dummyCompanies.map((comp, idx) => (
          <div key={idx} className="text-center">
            <img src={comp.logo} alt={comp.name} className="mb-2 rounded" />
            <p>{comp.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}