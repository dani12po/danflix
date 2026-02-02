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
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          {/* Placeholder for poster */}
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <Film className="w-16 h-16 text-slate-600" />
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </motion.div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-semibold">{film.rating}</span>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-xs text-white font-semibold uppercase">
              {film.type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
        </div>

        {/* Film Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {film.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{film.year}</span>
            </div>
            
            {film.type === 'tv' && film.seasons && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{film.seasons} Seasons</span>
              </div>
            )}
          </div>

          {/* Genre */}
          {film.genre && (
            <div className="mt-2">
              <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                {film.genre}
              </span>
            </div>
          )}
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            background: [
              'linear-gradient(45deg, transparent, transparent)',
              'linear-gradient(45deg, rgba(139, 92, 246, 0.3), transparent)',
              'linear-gradient(45deg, transparent, transparent)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    </motion.div>
  );
}
