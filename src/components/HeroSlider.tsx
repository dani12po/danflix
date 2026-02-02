'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, Star, Calendar, Film, Info } from 'lucide-react';
import { Film as FilmType } from '@/lib/api';

interface HeroSliderProps {
  films: FilmType[];
}

export function HeroSlider({ films }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

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

  if (!films.length) return null;

  const currentFilm = films[currentIndex];

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentFilm.poster}
              alt={currentFilm.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Type Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 px-3 py-1 rounded-full">
                      <Film className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-300 font-medium capitalize">
                        {currentFilm.type}
                      </span>
                    </div>
                    {currentFilm.rating > 0 && (
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-white font-medium">
                          {currentFilm.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {currentFilm.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-gray-300 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{currentFilm.year}</span>
                    </div>
                    {currentFilm.genre && (
                      <span className="bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                        {currentFilm.genre}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {currentFilm.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-gray-300 text-lg mb-8 line-clamp-3"
                    >
                      {currentFilm.description}
                    </motion.p>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={`/watch/${currentFilm.detailPath}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                      >
                        <Play className="h-5 w-5 fill-white" />
                        <span>Watch Now</span>
                      </motion.button>
                    </Link>
                    
                    <Link href={`/info/${currentFilm.detailPath}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 border border-white/20"
                      >
                        <Info className="h-5 w-5" />
                        <span>More Info</span>
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPrevious}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 border border-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {/* Dots Indicator */}
        <div className="flex items-center space-x-2">
          {films.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-purple-500'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              } rounded-full`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 border border-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Auto-play Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200 border border-white/20"
      >
        <div className={`w-8 h-8 rounded-full border-2 ${isAutoPlaying ? 'border-purple-500' : 'border-white/60'} p-1`}>
          <div className={`w-full h-full rounded-full ${isAutoPlaying ? 'bg-purple-500' : 'bg-white/60'}`} />
        </div>
      </motion.button>
    </div>
  );
}
