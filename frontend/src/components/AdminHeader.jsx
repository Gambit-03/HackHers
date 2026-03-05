import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminHeader() {
  return (
    <div className="admin-header mb-4">
      {/* Main Header */}
      <header className="bg-primary text-white py-3 px-4 rounded shadow">
        <h2 className="mb-0">PM Internship Dashboard</h2>
      </header>

    </div>
  );
}