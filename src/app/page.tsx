'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '@/lib/api';

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
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import FilmCard from '@/components/FilmCard';
import { Play, Star, TrendingUp, Film as FilmIcon, Tv, Gamepad2, Sparkles, Zap, Crown } from 'lucide-react';

export default function Home() {
  const [trending, setTrending] = useState<Film[]>([]);
  const [indonesianMovies, setIndonesianMovies] = useState<Film[]>([]);
  const [kdrama, setKdrama] = useState<Film[]>([]);
  const [anime, setAnime] = useState<Film[]>([]);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const results = await ApiService.search(query);
      setSearchResults(results.items);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchResults([]);
  };

  const handleFilmClick = (film: Film) => {
    // Navigate to film detail page
    window.location.href = `/watch/${film.id}`;
  };

  const getDisplayContent = () => {
    if (searchResults.length > 0) {
      return { title: `Search Results (${searchResults.length})`, films: searchResults };
    }

    switch (activeCategory) {
      case 'trending':
        return { title: 'Trending Now', films: trending };
      case 'movies':
        return { title: 'Indonesian Movies', films: indonesianMovies };
      case 'series':
        return { title: 'K-Drama Series', films: kdrama };
      case 'anime':
        return { title: 'Anime Collection', films: anime };
      default:
        return { title: 'Trending Now', films: trending };
    }
  };

  const { title, films } = getDisplayContent();

  const stats = [
    { icon: FilmIcon, label: 'Movies', value: '10,000+', color: 'from-purple-500 to-pink-500' },
    { icon: Tv, label: 'Series', value: '5,000+', color: 'from-blue-500 to-cyan-500' },
    { icon: Gamepad2, label: 'Anime', value: '3,000+', color: 'from-pink-500 to-rose-500' },
    { icon: Crown, label: 'Premium', value: '4K HDR', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar 
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />

        {/* Hero Section */}
        {!loading && !searchResults.length && (
          <section className="relative min-h-screen flex items-center justify-center">
            {/* Featured Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-slate-900/90 to-slate-950" />
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
              </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {/* Animated Title */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-400 mr-2" />
                  <h1 className="text-5xl md:text-7xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                      StreamFlix
                    </span>
                  </h1>
                  <Sparkles className="w-8 h-8 text-purple-400 ml-2" />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-300 mb-8"
                >
                  Experience Cinema Like Never Before
                </motion.p>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
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
                      className="relative group"
                    >
                      <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory('trending')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Start Watching
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Explore Premium
                  </span>
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
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-300 mb-2">Featured Today</h2>
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400">{featuredFilm.title}</span>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleFilmClick(featuredFilm)}
                    className="inline-block cursor-pointer"
                  >
                    <div className="relative group">
                      <div className="w-64 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl overflow-hidden border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                        <div className="w-full h-full flex items-center justify-center">
                          <FilmIcon className="w-24 h-24 text-purple-400" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading amazing content...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-4">
                <FilmIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-semibold">{error}</p>
              </div>
              <button 
                onClick={loadContent}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Search Results or Category Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-8 text-center">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h2>

                {films.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {films.map((film, index) => (
                      <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleFilmClick}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-gray-400">
                      <FilmIcon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold mb-2">No content found</p>
                      <p>Try searching for something else or browse different categories.</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Additional Categories (only show when not searching) */}
              {searchResults.length === 0 && activeCategory === 'all' && (
                <div className="space-y-16 mt-16">
                  {indonesianMovies.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-3xl font-bold mb-8 text-center">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          Indonesian Movies
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {indonesianMovies.slice(0, 10).map((film, index) => (
                          <FilmCard
                            key={film.id}
                            film={film}
                            onClick={handleFilmClick}
                            index={index}
                          />
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {kdrama.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-3xl font-bold mb-8 text-center">
                        <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                          K-Drama Series
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {kdrama.slice(0, 10).map((film, index) => (
                          <FilmCard
                            key={film.id}
                            film={film}
                            onClick={handleFilmClick}
                            index={index}
                          />
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {anime.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-3xl font-bold mb-8 text-center">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          Anime Collection
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {anime.slice(0, 10).map((film, index) => (
                          <FilmCard
                            key={film.id}
                            film={film}
                            onClick={handleFilmClick}
                            index={index}
                          />
                        ))}
                      </div>
                    </motion.section>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
