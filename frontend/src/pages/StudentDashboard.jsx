import SHeader from "../components/SHeader";
import SNavbar from "../components/SNavbar";
import DashboardContent from "../components/DashboardContent";

export default function StudentDashboard() {
  const mockStudent = { name: "Ashmita Yadav", email: "ashmita@example.com" };

  return (
    <div>
      <SHeader />
      <SNavbar student={mockStudent} />
      <DashboardContent student={mockStudent} />
    </div>
  );
}