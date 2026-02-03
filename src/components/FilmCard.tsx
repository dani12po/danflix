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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ 
        y: -8,
        scale: 1.03,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.97 }}
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
      {/* Enhanced Card Structure with New Theme */}
      <div className="card card-glass overflow-hidden group hover:shadow-gold">
        {/* Poster Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Enhanced Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-transparent opacity-90 z-10" />
          
          {/* Poster Image */}
          {film.poster ? (
            <img 
              src={film.poster} 
              alt={film.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Enhanced Poster Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-primary-medium to-primary-light flex items-center justify-center">
            <div className="relative">
              <Film className="w-20 h-20 text-accent-gold/30" />
              <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          {/* Enhanced Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-gradient-to-t from-primary-dark/95 via-primary-medium/50 to-transparent flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-full flex items-center justify-center shadow-gold"
              >
                <Play className="w-8 h-8 text-primary-dark ml-1" />
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-primary font-bold text-lg">Watch Now</span>
                <span className="text-secondary text-sm block mt-1">Click to play</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Badges */}
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-accent-gold to-accent-gold-dark backdrop-blur-sm px-3 py-1.5 rounded-full shadow-gold">
              <span className="text-xs text-primary-dark font-bold uppercase tracking-wide">
                {film.type === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>
          </div>
          
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-primary-dark/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-accent-gold/30">
              <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />
              <span className="text-xs text-primary font-bold">{film.rating}</span>
            </div>
          </div>

          {/* Genre Badge */}
          {film.genre && (
            <div className="absolute bottom-3 left-3 z-10">
              <div className="bg-primary-medium/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-accent-gold/20">
                <span className="text-xs text-secondary font-medium">{film.genre}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Film Info */}
        <div className="p-4 bg-gradient-to-t from-primary-medium to-primary-light">
          <h3 className="font-bold text-primary mb-3 line-clamp-2 leading-tight text-lg group-hover:text-accent-gold transition-colors">
            {film.title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-secondary">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                <span className="font-medium">{film.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{film.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4 text-accent-gold" />
              <span className="text-accent-gold text-xs font-medium">Play</span>
            </div>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  );
}
