'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Play, Star, Calendar, Clock, Film as FilmIcon, ArrowLeft, Share2, Heart, Plus, Download } from 'lucide-react';

interface Film {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: string;
  type: 'movie' | 'tv';
  genre: string;
  detailPath: string;
  description?: string;
  seasons?: number;
  episodes?: any[];
  playerUrl?: string;
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [film, setFilm] = useState<Film | null>(null);
  const [relatedFilms, setRelatedFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (slug) {
      loadFilmDetails();
    }
  }, [slug]);

  const loadFilmDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock film data for demo - replace with actual API call
      const mockFilm: Film = {
        id: slug,
        title: decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        poster: `/api/placeholder/400/600`,
        rating: 8.5,
        year: '2024',
        type: 'movie',
        genre: 'Action, Drama',
        detailPath: slug,
        description: 'An epic story that takes you on an unforgettable journey through stunning visuals and compelling narrative. This masterpiece combines cutting-edge cinematography with powerful performances.',
        seasons: 2,
        episodes: [],
        playerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };

      setFilm(mockFilm);

      // Load related films
      const relatedData = await ApiService.getTrending(1);
      setRelatedFilms(relatedData.items.slice(0, 6));

    } catch (err) {
      setError('Failed to load film details. Please try again.');
      console.error('Error loading film:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FilmIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">{error || 'Film not found'}</p>
            </div>
            <button 
              onClick={handleBack}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      {/* Hero Section with Film Background */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-slate-900/90 to-slate-950" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
        </div>

        {/* Film Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Film Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                <div className="relative group">
                  <div className="aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-purple-500/20">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <FilmIcon className="w-24 h-24 text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlay}
                      className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Film Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {/* Back Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Browse</span>
                </motion.button>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {film.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-semibold">{film.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{film.year}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 capitalize">{film.type}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{film.genre}</span>
                  {film.seasons && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{film.seasons} Seasons</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {film.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-colors text-lg"
                  >
                    <Play className="w-6 h-6" />
                    <span>Play Now</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-colors border border-white/20 text-lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span>My List</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-colors border border-white/20 text-lg"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>Share</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-colors border border-white/20 text-lg"
                  >
                    <Download className="w-6 h-6" />
                    <span>Download</span>
                  </motion.button>
                </div>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-800 border border-purple-500/20 rounded-lg p-4 mb-8"
                    >
                      <p className="text-sm text-gray-400 mb-2">Share this film:</p>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Facebook</button>
                        <button className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-sm">Twitter</button>
                        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">WhatsApp</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="relative w-full max-w-6xl mx-4">
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                Close Player
              </button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={film.playerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Films Section */}
      {relatedFilms.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Related Films
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedFilms.map((relatedFilm, index) => (
                <motion.div
                  key={relatedFilm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/watch/${relatedFilm.id}`)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <FilmIcon className="w-12 h-12 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-white truncate">{relatedFilm.title}</h3>
                  <p className="text-xs text-gray-400">{relatedFilm.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
