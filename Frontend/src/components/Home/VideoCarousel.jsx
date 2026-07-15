import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import api from '../../services/endpoints';

const VideoCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(api.successStory.get);
      if (res.data.success) {
        setVideos(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let animationId;
    const scroll = () => {
      if (scrollRef.current && !isPaused) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    if (videos.length > 0) {
      animationId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationId);
  }, [videos, isPaused]);

  if (loading) return <div className="h-48 flex items-center justify-center">Loading videos...</div>;
  if (videos.length === 0) return null;

  // Duplicate videos for infinite effect
  const displayVideos = [...videos, ...videos];

  return (
    <div
      className="relative w-full overflow-hidden py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden whitespace-nowrap cursor-pointer px-4 py-8"
        style={{ scrollBehavior: 'auto' }}
      >
        {displayVideos.map((video, index) => (
          <a
            key={`${video._id}-${index}`}
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-80 flex-shrink-0 group relative overflow-hidden rounded-2xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <div className="bg-yellow-600/90 rounded-full p-4 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                {video.duration}
              </div>
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-md">
              <h3 className="font-bold text-gray-800 text-sm whitespace-normal line-clamp-2 group-hover:text-yellow-600 transition-colors">
                {video.title}
              </h3>
              <div className="mt-2 flex items-center text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                <span>Watch Success Story</span>
                <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
