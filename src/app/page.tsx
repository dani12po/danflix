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
    <div className="min-h-screen bg-primary text-primary">
      <Navigation />
      
      <main className="main-content">
        {/* Hero Section - Enhanced with New Theme */}
        <section className="hero-section relative">
          {/* Background Video/Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-medium via-primary-dark to-primary-light opacity-40" />
            <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?random=hero')] bg-cover bg-center opacity-30" />
          </div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent-gold/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="hero-content relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8 inline-block"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-2xl flex items-center justify-center shadow-gold">
                  <Play className="w-12 h-12 text-primary-dark ml-1" />
                </div>
              </motion.div>
              
              {/* Title with Enhanced Typography */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 font-secondary"
              >
                <span className="text-gradient">
                  StreamFlix
                </span>
              </motion.h1>
              
              {/* Enhanced Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl text-secondary mb-4 max-w-3xl mx-auto font-light"
              >
                Watch Movies & Series Online
              </motion.p>
              
              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                <span className="px-4 py-2 bg-accent-gold/20 backdrop-blur-sm border border-accent-gold/30 rounded-full text-accent-gold text-sm font-medium">
                  🎬 Unlimited Movies
                </span>
                <span className="px-4 py-2 bg-accent-gold/20 backdrop-blur-sm border border-accent-gold/30 rounded-full text-accent-gold text-sm font-medium">
                  📺 TV Series
                </span>
                <span className="px-4 py-2 bg-accent-gold/20 backdrop-blur-sm border border-accent-gold/30 rounded-full text-accent-gold text-sm font-medium">
                  🎌 Anime Collection
                </span>
              </motion.div>
              
              {/* Enhanced CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244, 196, 48, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (trending.length > 0) {
                    router.push(`/watch/${trending[0].id}`);
                  } else {
                    router.push('/movies');
                  }
                }}
                className="btn btn-primary text-lg md:text-xl min-h-[56px] md:min-h-[64px] px-8 md:px-12 py-4 md:py-5 font-bold"
                role="button"
                aria-label="Start watching movies and series"
              >
                <span className="flex items-center gap-3">
                  Start Watching
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Content Sections */}
        <div className="content-section relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-medium/5 to-transparent pointer-events-none" />
          
          {loading ? (
            <div className="loading-container">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent-gold/20 border-t-accent-gold mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-accent-gold/10 blur-xl animate-pulse" />
              </div>
              <p className="mt-6 text-secondary text-lg font-medium">Loading amazing content...</p>
            </div>
          ) : error ? (
            <div className="error-container max-w-md mx-auto">
              <div className="bg-error/10 border border-error/20 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-error mb-6">{error}</p>
                <button 
                  onClick={loadContent}
                  className="btn btn-primary"
                  role="button"
                  aria-label="Try loading content again"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Trending Section - Enhanced */}
              {trending.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="content-section mb-16"
                >
                  <div className="section-header mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary-dark" />
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient font-secondary">
                        Trending Now
                      </h2>
                    </div>
                    <p className="text-secondary text-center max-w-2xl mx-auto">
                      Discover the most popular movies and series everyone is talking about
                    </p>
                  </div>
                  <div className="film-grid">
                    {trending.map((film, index) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Indonesian Movies Section - Enhanced */}
              {indonesianMovies.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="content-section mb-16"
                >
                  <div className="section-header mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center">
                        <FilmIcon className="w-6 h-6 text-primary-dark" />
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient font-secondary">
                        Indonesian Movies
                      </h2>
                    </div>
                    <p className="text-secondary text-center max-w-2xl mx-auto">
                      Explore the best Indonesian cinema from local talents
                    </p>
                  </div>
                  <div className="film-grid">
                    {indonesianMovies.map((film, index) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* K-Drama Section - Enhanced */}
              {kdrama.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="content-section mb-16"
                >
                  <div className="section-header mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center">
                        <Tv className="w-6 h-6 text-primary-dark" />
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient font-secondary">
                        K-Drama
                      </h2>
                    </div>
                    <p className="text-secondary text-center max-w-2xl mx-auto">
                      Get hooked on the latest Korean dramas and romantic stories
                    </p>
                  </div>
                  <div className="film-grid">
                    {kdrama.map((film, index) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Anime Section - Enhanced */}
              {anime.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="content-section mb-16"
                >
                  <div className="section-header mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-primary-dark" />
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient font-secondary">
                        Anime
                      </h2>
                    </div>
                    <p className="text-secondary text-center max-w-2xl mx-auto">
                      Dive into the world of Japanese animation and adventure
                    </p>
                  </div>
                  <div className="film-grid">
                    {anime.map((film, index) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Call to Action Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-20"
              >
                <div className="card-glass p-12 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient font-secondary">
                    Ready for more?
                  </h3>
                  <p className="text-secondary mb-8 max-w-2xl mx-auto">
                    Explore our full collection of movies, series, and anime. New content added daily!
                  </p>
                  <button
                    onClick={() => router.push('/movies')}
                    className="btn btn-primary"
                  >
                    Browse All Content
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
