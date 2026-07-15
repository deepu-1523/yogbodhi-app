import React from 'react';

const reasons = [
  { num: '01', title: 'Expert Faculty',          desc: 'Learn from IIT/AIIMS alumni and educators with proven NEET & JEE results year after year.', accent: '#ba9d25', bg: 'bg-yellow-50',  border: 'border-yellow-100' },
  { num: '02', title: 'Live & Recorded Classes', desc: 'Attend live sessions or watch recordings at your own pace — anytime, anywhere.',            accent: '#ba9d25', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  { num: '03', title: 'Regular Test Series',     desc: 'Weekly chapter tests, full-length mocks, and detailed analytics to track progress.',         accent: '#ba9d25', bg: 'bg-yellow-50',  border: 'border-yellow-100' },
  { num: '04', title: 'Personal Doubt Sessions', desc: 'One-on-one doubt clearing, dedicated WhatsApp groups, and personal mentorship.',              accent: '#ba9d25', bg: 'bg-yellow-50', border: 'border-yellow-100' },
];

const WhyChooseUs = () => (
  <div className="bg-line-grid py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left sticky */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <p className="text-xs font-bold text-[#ba9d25] uppercase tracking-widest mb-3">Why Roots Classes</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Everything you need to
            <span className="block mt-1 relative w-fit">
              crack your exam
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#ba9d25] rounded-full" />
            </span>
          </h2>
          <p className="text-sm text-gray-400 mt-8 leading-relaxed">
            Structured, focused, and results-driven programs trusted by thousands of students across Punjab.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-xl font-black text-[#ba9d25]">10K+</div>
              <div className="text-xs text-gray-400 mt-0.5">Students</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-xl font-black text-[#ba9d25]">98%</div>
              <div className="text-xs text-gray-400 mt-0.5">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Right numbered list */}
        <div className="lg:col-span-8 divide-y divide-gray-200">
          {reasons.map((r) => (
            <div key={r.num} className="flex items-start gap-5 py-6 group px-2 hover:bg-yellow-50 hover:shadow-sm rounded-xl transition-all cursor-pointer">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${r.bg} border ${r.border} flex items-center justify-center mt-0.5`}>
                <span className="text-sm font-black" style={{ color: r.accent }}>{r.num}</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
);

export default WhyChooseUs;
