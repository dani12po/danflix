'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ApiService, Film } from '@/lib/api';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Play, Star, TrendingUp, Film as FilmIcon, Tv, Gamepad2, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';

export default function Home() {
  const [trending, setTrending] = useState<Film[]>([]);
  const [indonesianMovies, setIndonesianMovies] = useState<Film[]>([]);
  const [kdrama, setKdrama] = useState<Film[]>([]);
  const [anime, setAnime] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trendingData, indoData, kdramaData, animeData] = await Promise.all([
        ApiService.getTrending(1),
        ApiService.getIndonesianMovies(1),
        ApiService.getKdrama(1),
        ApiService.getAnime(1),
      ]);

      setTrending(trendingData.items);
      setIndonesianMovies(indoData.items);
      setKdrama(kdramaData.items);
      setAnime(animeData.items);
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navigation />
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-slate-950" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none"
          >
            StreamFlix
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto"
          >
            Watch Movies & Series Online
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Navigate to movies page or featured content
              if (trending.length > 0) {
                router.push(`/watch/${trending[0].id}`);
              } else {
                router.push('/movies');
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-colors text-lg min-h-[44px] md:min-h-[48px] cursor-pointer"
          >
            Start Watching
          </motion.button>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16 md:space-y-24">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading content...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadContent}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {trending.length > 0 && (
              <section className="px-2 sm:px-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">Trending Now</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                  {trending.map((film) => (
                    <FilmCard
                      key={film.id}
                      film={film}
                    />
                  ))}
                </div>
              </section>
            )}

            {indonesianMovies.length > 0 && (
              <section className="px-2 sm:px-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">Indonesian Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                  {indonesianMovies.map((film) => (
                    <FilmCard
                      key={film.id}
                      film={film}
                    />
                  ))}
                </div>
              </section>
            )}

            {kdrama.length > 0 && (
              <section className="px-2 sm:px-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">K-Drama</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                  {kdrama.map((film) => (
                    <FilmCard
                      key={film.id}
                      film={film}
                    />
                  ))}
                </div>
              </section>
            )}

            {anime.length > 0 && (
              <section className="px-2 sm:px-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">Anime</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                  {anime.map((film) => (
                    <FilmCard
                      key={film.id}
                      film={film}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
