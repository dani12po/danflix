'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Film as FilmType } from '@/lib/api';

interface HeroSliderProps {
  films: FilmType[];
  onFilmClick?: (film: FilmType) => void;
}

export default function HeroSlider({ films, onFilmClick }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || films.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % films.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, films.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + films.length) % films.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % films.length);
    setIsAutoPlaying(false);
  };

  if (films.length === 0) return null;

  const currentFilm = films[currentIndex];

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-slate-900/80">
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-16 h-16 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{currentFilm.title}</h2>
              </div>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 line-clamp-2">
              {currentFilm.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{currentFilm.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{currentFilm.year}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300 capitalize">{currentFilm.type}</span>
              {currentFilm.genre && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{currentFilm.genre}</span>
                </>
              )}
            </div>

            {/* Description */}
            {currentFilm.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-300 text-lg mb-6 line-clamp-3"
              >
                {currentFilm.description}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilmClick?.(currentFilm)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilmClick?.(currentFilm)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold transition-colors border border-white/20"
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPrevious}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots */}
        <div className="flex space-x-2">
          {films.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-500 w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Auto-play Indicator */}
      <motion.div
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          {isAutoPlaying ? 'Pause' : 'Play'} Slideshow
        </button>
      </motion.div>
    </div>
  );
}
