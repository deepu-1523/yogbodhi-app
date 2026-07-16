import React from 'react';
import { GraduationCap, BookOpen, Stethoscope, User, Atom, FlaskConical, Calculator, Dna, Target } from 'lucide-react';
import heroImg from '../../assets/hero.png';

const HeroBanner = () => {
  return (
    <div className="w-full bg-[#f4f8ff] relative overflow-hidden flex flex-col justify-center min-h-[450px] lg:h-[500px]">

      {/* Background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dot pattern */}
        <div className="absolute left-0 top-0 w-1/3 h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        {/* Large circle behind the person */}
        <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-[#dbeafe] rounded-full opacity-60 translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
        {/* Light glow in the center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full opacity-70 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between h-full pb-16">

        {/* Left Column (Lists) */}
        <div className="flex flex-col gap-5 md:w-[25%] pt-8 md:pt-0 z-20">
          {[
            { icon: GraduationCap, text: 'Class 9-12' },
            { icon: BookOpen, text: 'Foundation' },
            { icon: Stethoscope, text: 'NEET' },
            { icon: User, text: 'JEE' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#0a1b4d] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <item.icon size={20} />
              </div>
              <div className="border-b border-gray-300 pb-2 w-full">
                <span className="font-bold text-[#0a1b4d] text-lg">{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Column (Logo & Tagline) */}
        <div className="flex flex-col items-center justify-center text-center md:w-[100%] px-13 py-8 md:py-0 z-20 mt-4 md:mt-0">
          <div className="flex items-center justify-center mb-6">
            {/* Text-based Logo to replicate the image */}
            <div className="flex items-center gap-1">
              <div className="relative flex items-center justify-center w-16 h-16 mr-3">
                <div className="absolute inset-0 border-4 border-t-red-500 border-r-green-500 border-b-yellow-400 border-l-blue-500 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <span className="text-2xl font-black text-green-600 font-serif">Y</span>
                <span className="text-2xl font-black text-blue-600 font-serif">G</span>
              </div>
              <div className="flex items-baseline leading-none tracking-tight gap-2">
                <span className="text-3xl md:text-[3rem] font-black text-[#0a1b4d]" style={{ fontFamily: 'Times New Roman, serif' }}>YOGBODHI</span>
                <span className="text-3xl md:text-[3rem] font-black text-[#f28e2b] italic" style={{ fontFamily: 'Times New Roman, serif' }}>GLOBAL</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a1b4d] text-white px-8 md:px-12 py-3.5 rounded-lg shadow-xl mb-6 transform -skew-x-6 border-b-4 border-[#061131] w-auto inline-block">
            <h2 className="text-xl md:text-2xl font-serif italic font-medium transform skew-x-6 tracking-wide drop-shadow-md">"Master the Roots, Rule the Results."</h2>
          </div>

          <div className="bg-white px-8 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-4">
            <Target className="text-[#d84040]" size={28} />
            <div className="text-lg md:text-xl font-bold text-[#0a1b4d] flex items-center gap-4">
              <span>Physics</span>
              <span className="text-[#ba9d28] font-black">|</span>
              <span>Chemistry</span>
              <span className="text-[#ba9d28] font-black">|</span>
              <span>Maths</span>
            </div>
          </div>
        </div>

        {/* Right Column (Instructor & Subjects) */}
        <div className="flex justify-center items-center md:w-[20%] relative z-20 h-[300px] md:h-full mt-8 md:mt-0 ">
          <div className="flex flex-col gap-5 absolute top-1/2 -translate-y-1/2 z-30">
            {[
              { icon: Atom, text: 'Physics' },
              { icon: FlaskConical, text: 'Chemistry' },
              { icon: Calculator, text: 'Maths' },
              { icon: Dna, text: 'Biology' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 group justify-end">
                <div className="border-b border-gray-300 pb-2 w-32 text-right hidden md:block">
                  <span className="font-bold text-[#0a1b4d] text-lg">{item.text}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#f28e2b] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md">
                  <item.icon size={20} />
                </div>
                <div className="border-b border-gray-300 pb-2 w-24 text-left md:hidden block">
                  <span className="font-bold text-[#0a1b4d] text-lg">{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="h-[400px] lg:h-[550px] flex items-end ml-auto relative z-10 w-full md:w-auto justify-end"> */}
          {/* Using the hero image from assets */}
          {/* <img src={heroImg} alt="Instructor" className="h-full max-h-[100%] object-contain object-bottom drop-shadow-2xl relative z-20" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600.png?text=Instructor+Image' }} /> */}
          {/* </div> */}
        </div>

      </div>

      {/* Bottom Wave Pattern */}
      <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none transform translate-y-[1px]">
        <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
          {/* Orange line wave */}
          <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,70 L0,70 Z" fill="#f28e2b" />
          {/* Dark blue solid wave */}
          <path d="M0,65 C320,125 420,5 720,65 C1020,125 1120,5 1440,65 L1440,120 L0,120 Z" fill="#0a1b4d" />
        </svg>
      </div>

    </div>
  );
};

export default HeroBanner;
