import { useEffect, useState } from "react";
import { getApplications, selectStudent } from "../../services/recruiterService";

function Applications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await getApplications();
    setData(res.data);
  };

  return (
    <div className="card p-4">
      <h4>Applications</h4>

      {data.map((internship) =>
        internship.applicants.map((student) => (
          <div
            key={student._id}
            className="d-flex justify-content-between border p-2 mb-2"
          >
            <div>{internship.role}</div>
            <div>{student.name}</div>
            <button
              className="btn btn-primary"
              onClick={() =>
                selectStudent(internship._id, student._id)
              }
            >
              Select
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Applications;