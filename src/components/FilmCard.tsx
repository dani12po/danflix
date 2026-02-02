'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Film } from 'lucide-react';
import { Film as FilmType } from '@/lib/api';

interface FilmCardProps {
  film: FilmType;
  index: number;
  variant?: 'default' | 'compact' | 'hero';
}

export function FilmCard({ film, index, variant = 'default' }: FilmCardProps) {
  const cardVariants = {
    default: 'w-full max-w-sm',
    compact: 'w-full max-w-xs',
    hero: 'w-full max-w-md'
  };

  const imageVariants = {
    default: 'aspect-[2/3]',
    compact: 'aspect-[2/3]',
    hero: 'aspect-[16/9]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ y: -8 }}
      className={`${cardVariants[variant]} group`}
    >
      <Link href={`/watch/${film.detailPath}`}>
        <div className="relative overflow-hidden rounded-xl bg-slate-800 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
          {/* Image Container */}
          <div className={`relative ${imageVariants[variant]} overflow-hidden`}>
            <Image
              src={film.poster}
              alt={film.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play Button Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-50" />
                <div className="relative bg-purple-600 rounded-full p-4">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </motion.div>
            </motion.div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full"
              >
                <Film className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-white font-medium capitalize">
                  {film.type}
                </span>
              </motion.div>
            </div>

            {/* Rating Badge */}
            {film.rating > 0 && (
              <div className="absolute top-2 right-2">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full"
                >
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white font-medium">
                    {film.rating.toFixed(1)}
                  </span>
                </motion.div>
              </div>
            )}
          </div>

          {/* Film Info */}
          <div className="p-4">
            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
              {film.title}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{film.year}</span>
              </div>
              
              {film.genre && (
                <div className="truncate max-w-[50%]">
                  <span className="text-xs bg-slate-700/50 px-2 py-1 rounded-full">
                    {film.genre.split(',')[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Hover Effect Border */}
          <motion.div
            layoutId={`border-${film.id}`}
            className="absolute inset-0 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function FilmCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'hero' }) {
  const cardVariants = {
    default: 'w-full max-w-sm',
    compact: 'w-full max-w-xs',
    hero: 'w-full max-w-md'
  };

  const imageVariants = {
    default: 'aspect-[2/3]',
    compact: 'aspect-[2/3]',
    hero: 'aspect-[16/9]'
  };

  return (
    <div className={`${cardVariants[variant]}`}>
      <div className="relative overflow-hidden rounded-xl bg-slate-800">
        <div className={`relative ${imageVariants[variant]} bg-slate-700 animate-pulse`} />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-700 rounded animate-pulse" />
          <div className="h-3 bg-slate-700 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
