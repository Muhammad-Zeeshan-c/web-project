import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';

// Navigation links array - each object has a label (text shown) and path (URL)
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'ATS Analyzer', to: '/analyzer' },
  { label: 'Interview Prep', to: '/interview' },
];

export const Navbar = () => {
  // useLocation gives us the current URL path (e.g. "/analyzer")
  const location = useLocation();
  // useNavigate lets us go to a different page programmatically
  const navigate = useNavigate();
  // mobileOpen tracks whether the mobile menu is open or closed
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if a nav link matches the current page URL
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo - clicking goes to home page */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-200">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-display font-700 text-slate-900 tracking-tight text-[15px]">
              ATS<span className="text-emerald-600">Pro</span>
            </span>
          </Link>

          {/* Desktop navigation links - hidden on small screens (md:flex) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA button - hidden on small screens */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/analyzer')}
              className="btn-primary text-xs px-4 py-2"
            >
              Analyze Resume
            </button>
          </div>

          {/* Mobile menu toggle button - only visible on small screens */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {/* Show X icon when menu is open, hamburger Menu icon when closed */}
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu - only shows when mobileOpen is true */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { navigate('/analyzer'); setMobileOpen(false); }}
              className="w-full mt-2 btn-primary text-sm"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
