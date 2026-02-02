'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Play, Star, TrendingUp, Film as FilmIcon, Tv, Gamepad2, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';

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

export default function Home() {
  const router = useRouter();
  const [trending, setTrending] = useState<Film[]>([]);
  const [indonesianMovies, setIndonesianMovies] = useState<Film[]>([]);
  const [kdrama, setKdrama] = useState<Film[]>([]);
  const [anime, setAnime] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredFilm, setFeaturedFilm] = useState<Film | null>(null);

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
      
      // Set featured film (first trending film)
      if (trendingData.items.length > 0) {
        setFeaturedFilm(trendingData.items[0]);
      }
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilmClick = (film: Film) => {
    router.push(`/watch/${film.id}`);
  };

  const stats = [
    { icon: FilmIcon, label: 'Movies', value: '10,000+', color: 'from-purple-500 to-pink-500' },
    { icon: Tv, label: 'Series', value: '5,000+', color: 'from-blue-500 to-cyan-500' },
    { icon: Gamepad2, label: 'Anime', value: '3,000+', color: 'from-pink-500 to-rose-500' },
    { icon: Crown, label: 'Premium', value: '4K HDR', color: 'from-yellow-500 to-orange-500' },
  ];

  const categories = [
    { name: 'Action', icon: FilmIcon, color: 'from-red-500 to-orange-500' },
    { name: 'Drama', icon: Tv, color: 'from-blue-500 to-purple-500' },
    { name: 'Comedy', icon: Sparkles, color: 'from-yellow-500 to-green-500' },
    { name: 'Thriller', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { name: 'Romance', icon: Crown, color: 'from-pink-500 to-rose-500' },
    { name: 'Sci-Fi', icon: Gamepad2, color: 'from-cyan-500 to-blue-500' },
  ];

  const features = [
    { title: '4K HDR Quality', description: 'Crystal clear picture quality', icon: Crown },
    { title: 'Fast Streaming', description: 'No buffering, instant play', icon: Zap },
    { title: 'Premium Content', description: 'Exclusive movies and series', icon: Star },
    { title: 'No Ads', description: 'Uninterrupted viewing experience', icon: Play },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500" />
          </div>
        </div>
        
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-purple-400 mr-3" />
              <h1 className="hero-title">StreamFlix</h1>
              <Sparkles className="w-10 h-10 text-purple-400 ml-3" />
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hero-subtitle"
            >
              Experience Cinema Like Never Before
            </motion.p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hero-actions"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => featuredFilm && handleFilmClick(featuredFilm)}
              className="btn-primary text-lg px-8 py-4 relative z-50"
            >
              <Play className="w-6 h-6 mr-2" />
              Watch Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/movies')}
              className="btn-secondary text-lg px-8 py-4 relative z-50"
            >
              <ChevronRight className="w-6 h-6 mr-2" />
              Browse Movies
            </motion.button>
          </motion.div>

          {/* Featured Film Preview */}
          {featuredFilm && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-300 mb-3">Featured Today</h2>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 text-lg">{featuredFilm.title}</span>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleFilmClick(featuredFilm)}
                className="inline-block cursor-pointer"
              >
                <div className="relative group">
                  <div className="w-80 h-120 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl overflow-hidden border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <FilmIcon className="w-32 h-32 text-purple-400" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                    <Play className="w-20 h-20 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
            <p className="section-subtitle">Discover your favorite genres</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card text-center cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Today Section */}
      {!loading && trending.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Today</h2>
              <p className="section-subtitle">Hand-picked movies and series</p>
            </div>
            
            <div className="featured-slider">
              {trending.slice(0, 10).map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleFilmClick(film)}
                  className="featured-slide cursor-pointer"
                >
                  <div className="film-card">
                    <div className="film-poster bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <FilmIcon className="w-16 h-16 text-purple-400" />
                    </div>
                    <div className="film-info">
                      <h3 className="film-title">{film.title}</h3>
                      <div className="film-meta">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{film.rating}</span>
                        <span>•</span>
                        <span>{film.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now Section */}
      {!loading && trending.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Trending Now</h2>
              <p className="section-subtitle">Most popular content right now</p>
            </div>
            
            <div className="film-grid">
              {trending.slice(0, 12).map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleFilmClick(film)}
                  className="film-card cursor-pointer"
                >
                  <div className="film-poster bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <FilmIcon className="w-12 h-12 text-purple-400" />
                  </div>
                  <div className="film-info">
                    <h3 className="film-title">{film.title}</h3>
                    <div className="film-meta">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{film.rating}</span>
                      <span>•</span>
                      <span>{film.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose StreamFlix</h2>
            <p className="section-subtitle">The best streaming experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="card text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FilmIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">{error}</p>
            </div>
            <button 
              onClick={loadContent}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
