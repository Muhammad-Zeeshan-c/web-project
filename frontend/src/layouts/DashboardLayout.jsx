import { Navbar } from '../components/Navbar';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};
