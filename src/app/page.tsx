'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ApiService, Film } from '@/lib/api';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Play, Star, TrendingUp, Film as FilmIcon, Tv, Gamepad2, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [trending, setTrending] = useState<Film[]>([]);
  const [indonesianMovies, setIndonesianMovies] = useState<Film[]>([]);
  const [kdrama, setKdrama] = useState<Film[]>([]);
  const [anime, setAnime] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const handleFilmClick = (film: Film) => {
    router.push(`/watch/${film.id}`);
  };

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
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-slate-950 z-0" />
          <div className="hero-content">
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
                if (trending.length > 0) {
                  router.push(`/watch/${trending[0].id}`);
                } else {
                  router.push('/movies');
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-colors text-lg min-h-[44px] md:min-h-[48px] cursor-pointer z-button"
            >
              Start Watching
            </motion.button>
          </div>
        </section>

        {/* Content Sections */}
        <div className="content-section">
          {loading ? (
            <div className="loading-container">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading content...</p>
            </div>
          ) : error ? (
            <div className="error-container text-red-500">
              <p>{error}</p>
              <button 
                onClick={loadContent}
                className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full transition-colors z-button"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {trending.length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Trending Now</h2>
                  </div>
                  <div className="film-grid">
                    {trending.map((film) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {indonesianMovies.length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Indonesian Movies</h2>
                  </div>
                  <div className="film-grid">
                    {indonesianMovies.map((film) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {kdrama.length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">K-Drama</h2>
                  </div>
                  <div className="film-grid">
                    {kdrama.map((film) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {anime.length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Anime</h2>
                  </div>
                  <div className="film-grid">
                    {anime.map((film) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
