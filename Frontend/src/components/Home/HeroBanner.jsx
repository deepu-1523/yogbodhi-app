import React from 'react';
import { GraduationCap, BookOpen, Stethoscope, User, Atom, FlaskConical, Calculator, Dna, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden min-h-[600px] flex items-center">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-200/40 to-yellow-200/40 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4=')] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-5 md:py-1 lg:pt-0">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center lg:items-start">

          {/* Left Content Area */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:pt-0">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200 shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="text-sm font-semibold text-orange-600 tracking-wide uppercase">Admissions Open 2025-26</span>
            </div>

            {/* Main Title & Logo */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl my-3 font-black tracking-tight text-[#0a1b4d]" style={{ fontFamily: 'Times New Roman, serif' }}>
                  YOGBODHI <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 italic">GLOBAL</span>
                </h1>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                Master the Roots, <br className="hidden lg:block" />
                <span className="relative inline-block mt-2">
                  Rule the Results.
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-orange-200/60 -z-10 rounded-sm transform -rotate-1"></div>
                </span>
              </h2>

              <p className="text-gray-600 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed ">
                Empowering students in Class 9-12, Foundation, NEET & JEE with expert guidance in Physics, Chemistry, Maths & Biology.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 my-2 ">
              <Link to="/course" className="pl-2 px-1 py-2 rounded-full bg-[#0a1b4d] text-white font-semibold text-l hover:bg-blue-900 transition-all duration-300 shadow-[0_8px_20px_rgba(10,27,77,0.25)] hover:shadow-[0_10px_25px_rgba(10,27,77,0.35)] hover:-translate-y-1 flex items-center group">
                Explore Courses
                <ArrowRight size={20} className="group-hover:translate-x transition-transform" />
              </Link>
              <Link to="/contact" className="px-2 py-2 rounded-full bg-[#0a1b4d] text-white border-2 border-gray-100 font-semibold text-l hover:border-orange-200 hover:bg-orange-500 transition-all duration-300 shadow-sm flex items-center gap-2 group">
                <PlayCircle size={22} className="text-orange-50 group-hover:scale-110 transition-transform" />
                Book Demo Class
              </Link>
            </div>

            {/* Stats / Trust */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-6 border-t border-gray-200/60 w-full justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden z-10">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-medium text-gray-700">Trusted by 1000+ Students</span>
              </div>
            </div>

          </div>

          {/* Right Visual Area - Glassmorphism floating cards */}
          <div className="relative h-[500px] w-full hidden lg:flex items-center justify-center lg:mt-4">
            {/* Center Core */}
            <div className="absolute z-20 w-32 h-35 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-orange-50">
              <img src="/assets/yogbodhi.png" alt="Yogbodhi Logo" className="w-full h-auto object-contain drop-shadow-md" />
            </div>

            {/* Orbiting rings */}
            <div className="absolute w-[300px] h-[300px] border border-gray-300/40 rounded-full animate-[spin_40s_linear_infinite]"></div>
            <div className="absolute w-[450px] h-[450px] border border-dashed border-gray-300/40 rounded-full animate-[spin_60s_linear_infinite_reverse]"></div>

            {/* Floating Subject Cards */}
            <div className="absolute top-[10%] left-[10%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-[bounce_4s_infinite] hover:scale-105 transition-transform cursor-pointer z-30">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Atom size={24} /></div>
              <div><p className="font-bold text-gray-800">Physics</p><p className="text-xs text-gray-500">Concepts Clear</p></div>
            </div>

            <div className="absolute bottom-[15%] left-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-[bounce_5s_infinite_0.5s] hover:scale-105 transition-transform cursor-pointer z-30">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600"><FlaskConical size={24} /></div>
              <div><p className="font-bold text-gray-800">Chemistry</p><p className="text-xs text-gray-500">Reactions Mastered</p></div>
            </div>

            <div className="absolute top-[15%] right-[5%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-[bounce_6s_infinite_1s] hover:scale-105 transition-transform cursor-pointer z-30">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600"><Calculator size={24} /></div>
              <div><p className="font-bold text-gray-800">Maths</p><p className="text-xs text-gray-500">Problem Solving</p></div>
            </div>

            <div className="absolute bottom-[20%] right-[10%] bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-[bounce_4.5s_infinite_1.5s] hover:scale-105 transition-transform cursor-pointer z-30">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Dna size={24} /></div>
              <div><p className="font-bold text-gray-800">Biology</p><p className="text-xs text-gray-500">Life Sciences</p></div>
            </div>

            {/* Target Classes Badge */}
            <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-[#0a1b4d] text-white px-6 py-2 rounded-full shadow-lg border-2 border-white z-30">
              <span className="font-bold text-sm tracking-wide whitespace-nowrap">Class 9-12 | NEET | JEE</span>
            </div>

          </div>

          {/* Mobile Grid for Subjects (only shows on mobile/tablet) */}
          <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 w-full px-2 mt-4">
            {[
              { icon: Atom, text: 'Physics', bg: 'bg-blue-50', textCol: 'text-blue-500' },
              { icon: FlaskConical, text: 'Chemistry', bg: 'bg-green-50', textCol: 'text-green-500' },
              { icon: Calculator, text: 'Maths', bg: 'bg-orange-50', textCol: 'text-orange-500' },
              { icon: Dna, text: 'Biology', bg: 'bg-purple-50', textCol: 'text-purple-500' },
              { icon: GraduationCap, text: 'Class 9-12', bg: 'bg-indigo-50', textCol: 'text-indigo-500' },
              { icon: Stethoscope, text: 'NEET/JEE', bg: 'bg-red-50', textCol: 'text-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 text-center hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full ${item.bg} ${item.textCol} flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Wave Pattern */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none transform translate-y-[1px]">
        <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
          <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,70 L0,70 Z" fill="#f28e2b" />
          <path d="M0,65 C320,125 420,5 720,65 C1020,125 1120,5 1440,65 L1440,120 L0,120 Z" fill="#0a1b4d" />
        </svg>
      </div>

    </div>
  );
};

export default HeroBanner;
