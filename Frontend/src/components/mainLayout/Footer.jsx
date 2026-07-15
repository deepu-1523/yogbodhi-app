import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Classroom Courses", href: "/course" },
    { name: "Test Series", href: "/test" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms & Conditions", href: "/termsandconditions" },
    { name: "Privacy Policy", href: "/privacypolicy" }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={18} />,
      href: "https://www.facebook.com/rootsclasses1313/",
      color: "hover:bg-blue-600"
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={18} />,
      href: "https://www.instagram.com/roots_classes?igsh=cndtdml4MW0wNmFz",
      color: "hover:bg-pink-600"
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={18} />,
      href: "https://www.linkedin.com/company/roots-classes/",
      color: "hover:bg-blue-700"
    },
    {
      name: "YouTube",
      icon: <FaYoutube size={18} />,
      href: "https://www.youtube.com/@nikolaphysics",
      color: "hover:bg-yellow-600"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Responsive Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-8 mb-8 md:mb-10 lg:mb-12">

          {/* Brand Section - Centered on mobile, left on desktop */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="mb-6">
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <Link to="/" className="flex items-center space-x-3">
                  <img src="/assets/yogbodhi.png" alt="Roots Classes Logo" className="h-15 w-auto" />
                </Link>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4 max-w-md mx-auto md:mx-0">
                Empowering learners worldwide. Discover courses, tutorials, and resources to enhance your skills.
              </p>
            </div>

            {/* Social Links - Centered on mobile, left on desktop */}
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.name} page`}
                  className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 transition-all duration-300 hover:text-white ${social.color} hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ba9d25] focus:ring-offset-2 focus:ring-offset-gray-800`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Centered on mobile, left on desktop */}
          <div className="text-center md:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-6 relative inline-block md:inline-block">
              Pages
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ba9d25] to-[#a88c21] mt-1 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0"></div>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group justify-center md:justify-start"
                  >
                    <ChevronRight size={14} className="text-[#ba9d25] transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information - Centered on mobile, left on desktop */}
          <div className="text-center md:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-6 relative inline-block md:inline-block">
              Corporate Office
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#ba9d25] to-[#a88c21] mt-1 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0"></div>
            </h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-3 group justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ba9d25] transition-all duration-300">
                  <Phone size={18} className="text-gray-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm sm:text-base">
                    +91 98775-15330
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 group justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ba9d25] transition-all duration-300">
                  <Mail size={18} className="text-gray-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm sm:text-base break-all">
                    yogbodhiglobal1313@gmail.com
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 group justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#ba9d25] transition-all duration-300">
                  <MapPin size={18} className="text-gray-300 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Gill Rd, opp. Opposite ITI College,<br />
                    Shilapuri, Ludhiana, Punjab 141003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - Fully Responsive */}
        <div className="border-t border-gray-700/50 pt-6 sm:pt-8 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} Yogbodhi Global. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex flex-wrap justify-center gap-x-3 gap-y-1">
              <Link to="/termsandconditions" className="hover:text-white transition-colors duration-200">
                Terms
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/privacypolicy" className="hover:text-white transition-colors duration-200">
                Privacy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/contact" className="hover:text-white transition-colors duration-200">
                Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-[#ba9d25] via-[#a88c21] to-[#947b1c]"></div>
    </footer>
  );
};

export default Footer;