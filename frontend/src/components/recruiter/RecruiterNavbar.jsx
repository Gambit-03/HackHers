function RecruiterNavbar({ verified, setActive }) {
  return (
    <nav className="navbar bg-light px-4">
      {!verified ? (
        <button
          className="btn btn-primary"
          onClick={() => setActive("verify")}
        >
          Profile Verification
        </button>
      ) : (
        <>
          <button
            className="btn btn-success"
            onClick={() => setActive("post")}
          >
            Post Internship
          </button>

          <button
            className="btn btn-warning"
            onClick={() => setActive("applications")}
          >
            🔔 Applications
          </button>
        </>
      )}
    </nav>
  );
}

export default RecruiterNavbar;