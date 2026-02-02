'use client';

import { motion } from 'framer-motion';
import { Play, Star, Calendar, Clock, Film } from 'lucide-react';
import { Film as FilmType } from '@/lib/api';

interface FilmCardProps {
  film: FilmType;
  onClick?: (film: FilmType) => void;
  index?: number;
}

export default function FilmCard({ film, onClick, index = 0 }: FilmCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(film);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="group relative cursor-pointer film-card"
      role="button"
      tabIndex={0}
      aria-label={`Watch ${film.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Simplified Card Structure */}
      <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        {/* Poster Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          {/* Poster Placeholder */}
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <Film className="w-16 h-16 text-slate-600 flex-shrink-0" />
          </div>

          {/* Hover Overlay - Simplified */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1 flex-shrink-0" />
              </div>
              <span className="text-white font-medium">Watch Now</span>
            </div>
          </motion.div>

          {/* Badges - Simplified */}
          <div className="absolute top-2 left-2 bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-xs text-white font-semibold uppercase">
              {film.type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
          
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-semibold">{film.rating}</span>
          </div>
        </div>

        {/* Film Info - Simplified */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 leading-tight">{film.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span>{film.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{film.year}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
