import React, { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import Classes from './Classes';
import Testimonial from './Testimonial';
import CallBack from './CallBack';
import Experts from './Experts';
import StatsBar from './StatsBar';
import WhyChooseUs from './WhyChooseUs';
import FAQ from './FAQ';
import axios from 'axios';
import api from '../../services/endpoints';
import fallbackImage from '../../assets/fallback.jpg';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SliderPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    {
      _id: 'default',
      image: fallbackImage,
      desktopImage: fallbackImage,
      tabletImage: fallbackImage,
      mobileImage: fallbackImage,
      title: "Roots Classes",
      subtitle: "Empowering Your Future with Quality Education",
      buttonText: "Explore Courses",
      classText: "Join the Journey"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const GetSlider = async () => {
    try {
      // Keep showing the default slide while loading
      const res = await axios.post(api.slider.getSlider);
      if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSlides(res.data.data);
      } else if (res.data?.data?.data && Array.isArray(res.data.data.data) && res.data.data.data.length > 0) {
        setSlides(res.data.data.data);
      }
      // If API fails or returns empty, we keep the default slide
    } catch (error) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { GetSlider(); }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length > 0 && !isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length, isPaused]);

  return (
    <>
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Stats Bar */}
      <div className="relative z-20">
        <StatsBar />
      </div>

      {/* Programs */}
      <Classes />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Expert Faculty */}
      <Experts />

      {/* Student Testimonials + Videos */}
      <Testimonial />

      {/* FAQ */}
      <FAQ />

      {/* Callback Form */}
      <CallBack />
    </>
  );
};

export default SliderPage;
