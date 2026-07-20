import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, UserCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useStudentStore from '../../Store/studentstore';
import { SiCoursera } from 'react-icons/si';
import NotificationDropdown from '../Notification/NotificationDropdown';

const navItems = [
  { name: 'Courses', path: '/course' },
  { name: '100% Scholarship', path: '/scholarship' },
  { name: 'Test Series', path: '/test' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { student, logout, setStudent } = useStudentStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* auth check */
  useEffect(() => {
    const check = () => {
      if (student && (student._id || student.id)) { setIsLoggedIn(true); return; }
      try {
        const s = localStorage.getItem('student');
        if (s) { const p = JSON.parse(s); if (p?._id || p?.id) { setIsLoggedIn(true); if (!student && setStudent) setStudent(p); return; } }
        const u = localStorage.getItem('user');
        if (u) { const p = JSON.parse(u); if (p?._id || p?.id) { setIsLoggedIn(true); return; } }
      } catch { }
      setIsLoggedIn(false);
    };
    check();
  }, [student, setStudent]);

  /* click outside */
  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const getName = () => {
    if (student?.fullName) return student.fullName;
    if (student?.name) return student.name;
    try {
      const s = JSON.parse(localStorage.getItem('student') || '{}');
      return s.fullName || s.name || s.username || s.email?.split('@')[0] || 'Student';
    } catch { return 'Student'; }
  };

  const getEmail = () => {
    if (student?.email) return student.email;
    try { return JSON.parse(localStorage.getItem('student') || '{}').email || ''; } catch { return ''; }
  };

  const isAdminOrInstructor = () => ['admin', 'instructor'].includes(student?.role);
  const isStudent = () => student?.role === 'student' || (!student?.role && isLoggedIn);

  const handleLogout = () => {
    ['user', 'student', 'token', 'authToken', 'studentToken'].forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    logout?.();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/stdlogin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[60] w-full">
      {/* Announcement bar (Glassmorphism Light) */}
      <div className="relative overflow-hidden bg-[#fdfdfd]/80 backdrop-blur-md border-b border-gray-200/50 py-1 px-4 text-center">
        {/* Subtle decorative color accents */}
        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-[#ba9d25]/5 to-[#ba9d25]/1 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-[#ba9d25]/5 to-[#ba9d25]/1 pointer-events-none" />

        <div className="relative z-10 overflow-hidden w-full">
          <div className="animate-marquee flex items-center gap-4 text-[10px] sm:text-xs tracking-wide">
            <span className="flex items-center gap-1.5 font-bold text-gray-700 bg-[#FEF2F2] px-3 py-0.5 rounded-full border border-yellow-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba9d25] animate-pulse"></span>
              Admissions open for 2025-26 batch
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <Link to="/scholarship" className="group flex items-center gap-1 font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ba9d25] to-[#a88c21] group-hover:from-[#a88c21] group-hover:to-[#ba9d25] transition-all">
                Apply for 100% Scholarship
              </span>
              <span className="text-[#ba9d25] group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white/70 backdrop-blur-md transition-shadow duration-200 ${scrolled ? 'shadow-[10_1px_240px_rgba(0,0,0,0.08)]' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2">
          <div className="flex justify-between items-center h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/assets/yogbodhi.png" alt="Roots Classes" className="h-15 w-auto ml-2" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'text-[#ba9d25] bg-yellow-50 shadow-lg'
                    : 'text-gray-600 hover:text-[#ba9d25] hover:bg-yellow-50/50 hover:shadow-lg'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <NotificationDropdown />
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 bg-white transition-colors text-sm cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#ba9d25] flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-200">
                        <User size={13} className="text-white" />
                      </div>
                      <span className="text-gray-700 font-medium max-w-[120px] truncate group-hover:text-[#ba9d25] transition-colors">{getName()}</span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-[#ba9d25]' : 'group-hover:text-[#ba9d25]'}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#ba9d25] rounded-full flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{getName()}</p>
                              {getEmail() && <p className="text-xs text-gray-400 truncate">{getEmail()}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          {isAdminOrInstructor() && (
                            <button onClick={() => { navigate('/admin/'); setIsDropdownOpen(false); }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                              <LayoutDashboard size={16} className="text-gray-400" />Dashboard
                            </button>
                          )}
                          {isStudent() && (
                            <>
                              <button onClick={() => { navigate('/stdprofile'); setIsDropdownOpen(false); }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                <UserCircle size={16} className="text-gray-400" />My Profile
                              </button>
                              <button onClick={() => { navigate('/purchescourse'); setIsDropdownOpen(false); }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                <SiCoursera size={16} className="text-gray-400" />My Courses
                              </button>
                            </>
                          )}
                        </div>
                        <div className="border-t border-gray-100 pt-1">
                          <button onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors cursor-pointer">
                            <LogOut size={16} />Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/stdlogin">
                    <button className="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:border-[#ba9d25] hover:bg-[#ba9d25] transition-all duration-300 cursor-pointer bg-green-500 text-white">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ba9d28] to-[#a88c21] hover:from-[#a88c21] hover:to-[#947b1c] rounded-xl transition-all duration-300 shadow-md shadow-yellow-200 hover:shadow-lg hover:shadow-yellow-300 hover:-translate-y-0.5 cursor-pointer">
                      Sign Up Free
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full right-0 w-[100%] border-t border-gray-100 bg-white shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(item.path) ? 'text-[#ba9d25] bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 pt-3 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 bg-[#ba9d25] rounded-full flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getName()}</p>
                        {getEmail() && <p className="text-xs text-gray-400">{getEmail()}</p>}
                      </div>
                    </div>
                    {isAdminOrInstructor() && (
                      <Link to="/admin/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={16} className="text-gray-400" />Dashboard
                      </Link>
                    )}
                    {isStudent() && (
                      <>
                        <Link to="/stdprofile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                          <UserCircle size={16} className="text-gray-400" />My Profile
                        </Link>
                        <Link to="/purchescourse" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                          <SiCoursera size={16} className="text-gray-400" />My Courses
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-yellow-600 hover:bg-yellow-50 cursor-pointer">
                      <LogOut size={16} />Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-1">
                    <Link to="/stdlogin" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-[#ba9d25] hover:text-[#ba9d25] hover:bg-yellow-50 rounded-xl cursor-pointer transition-all">Login</button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ba9d25] to-[#a88c21] hover:from-[#a88c21] hover:to-[#947b1c] shadow-md shadow-yellow-200 rounded-xl cursor-pointer transition-all">Sign Up Free</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header >
  );
};

export default Navbar;
