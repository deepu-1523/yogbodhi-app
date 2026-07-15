import React from 'react';
import { Link } from 'react-router-dom';

const programs = [
  {
    num: '01', tag: 'Class 8–10', title: 'Foundation',
    desc: 'Build strong fundamentals. Integrated prep for boards with NEET & JEE introduction.',
    courses: [
      '1-year integrated with class 10th for Board | NEET | JEE',
      '2-year integrated with class 10th for Board | NEET | JEE',
    ],
    dark: false, accent: '#ba9d25',
  },
  {
    num: '02', tag: 'NEET', title: 'Medical',
    desc: 'Crack NEET with structured programs led by experienced medical faculty.',
    courses: [
      '1-year integrated program class 12th',
      '2-year integrated classroom 11th & 12th',
      '1-year dropper course for NEET',
    ],
    dark: true, accent: '#ba9d25',
  },
  {
    num: '03', tag: 'IIT-JEE', title: 'Engineering',
    desc: 'Master PCM with JEE-focused curriculum and intensive test series.',
    courses: [
      '1-year integrated program class 12th',
      '2-year integrated classroom 11th & 12th',
      '1-year dropper course for IIT-JEE',
    ],
    dark: false, accent: '#ba9d25',
  },
];

const ProgramPage = () => (
  <div className="bg-dot-grid py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <p className="text-xs font-bold text-[#ba9d25] uppercase tracking-widest mb-3">Our Programs</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Choose your stream</h2>
        </div>
        <Link to="/course" className="text-sm font-semibold text-gray-900 border-b-2 border-gray-200 hover:border-[#ba9d25] hover:text-[#ba9d25] transition-all pb-0.5 self-end group flex items-center gap-1">
          View all courses <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Card 01 — wide light */}
        <div className="md:col-span-5 bg-white rounded-2xl p-7 flex flex-col justify-between border border-gray-200 hover:border-[#ba9d25]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-yellow-50 text-[#ba9d25]">{programs[0].tag}</span>
              <span className="text-6xl font-black text-gray-100 group-hover:text-[#ba9d25]/10 transition-colors leading-none">{programs[0].num}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{programs[0].title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{programs[0].desc}</p>
            <ul className="space-y-2.5">
              {programs[0].courses.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[#ba9d25] flex-shrink-0" />
                  <span className="text-sm text-gray-500">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/course">
            <button className="mt-7 w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#ba9d25] to-[#a88c21] text-white hover:from-[#a88c21] hover:to-[#947b1c] hover:shadow-lg hover:shadow-yellow-200 hover:-translate-y-0.5 transition-all duration-300">
              Explore Foundation →
            </button>
          </Link>
        </div>

        {/* Right column */}
        <div className="md:col-span-7 grid grid-rows-2 gap-4">

          {/* Card 02 — light (Medical) */}
          <div className="bg-white rounded-2xl p-7 flex flex-col justify-between group border border-gray-100 hover:border-[#ba9d25]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            {/* Red glow accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ba9d25]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ba9d25]/10 transition-colors" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-yellow-50 text-[#ba9d25]">{programs[1].tag}</span>
                <span className="text-6xl font-black text-gray-100 group-hover:text-[#ba9d25]/10 transition-colors leading-none">{programs[1].num}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{programs[1].title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{programs[1].desc}</p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2 flex-wrap">
                {programs[1].courses.map((_, i) => (
                  <span key={i} className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Option {i + 1}</span>
                ))}
              </div>
              <Link to="/course">
                <button className="flex-shrink-0 ml-3 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#ba9d28] to-[#a88c21] text-white hover:from-[#a88c21] hover:to-[#947b1c] hover:shadow-lg hover:shadow-yellow-200 hover:-translate-y-0.5 transition-all duration-300">
                  Enroll →
                </button>
              </Link>
            </div>
          </div>

          {/* Card 03 — light */}
          <div className="bg-white rounded-2xl p-7 flex flex-col justify-between border border-gray-200 hover:border-[#ba9d25]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-yellow-50 text-[#ba9d25]">{programs[2].tag}</span>
                <span className="text-6xl font-black text-gray-100 group-hover:text-[#ba9d25]/10 transition-colors leading-none">{programs[2].num}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{programs[2].title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{programs[2].desc}</p>
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-gray-400">{programs[2].courses.length} course options</span>
              <Link to="/course">
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#ba9d28] text-white hover:bg-[#4A5565] hover:shadow-lg hover:shadow-yellow-200 hover:-translate-y-0.5 transition-all duration-300">
                  Start Learning →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature pills */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: '🎓', label: 'Expert Faculty', color: 'border-yellow-100 hover:border-[#ba9d25] hover:bg-yellow-50' },
          { icon: '📡', label: 'Live Classes', color: 'border-yellow-100 hover:border-[#ba9d25] hover:bg-yellow-50' },
          { icon: '📝', label: 'Test Series', color: 'border-yellow-100 hover:border-[#ba9d25] hover:bg-yellow-50' },
          { icon: '💬', label: '24/7 Support', color: 'border-yellow-100 hover:border-[#ba9d25] hover:bg-yellow-50' },
        ].map((f) => (
          <div key={f.label} className={`bg-white rounded-xl px-5 py-3.5 flex items-center gap-3 border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md ${f.color}`}>
            <span>{f.icon}</span>
            <span className="text-sm font-medium text-gray-700">{f.label}</span>
          </div>
        ))}
      </div>

    </div>
  </div>
);

export default ProgramPage;
