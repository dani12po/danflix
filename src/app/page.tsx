'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiService, Film } from '@/lib/api';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import FilmCard from '@/components/FilmCard';

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
    console.log('Film clicked:', film);
    // For now, just log the film
    // In a real app, you would navigate to /watch/[slug] or similar
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar 
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {/* Hero Section */}
      {trending.length > 0 && !searchResults.length && (
        <HeroSlider 
          films={trending.slice(0, 5)}
          onFilmClick={handleFilmClick}
        />
      )}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading amazing content...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
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
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
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
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
                    </svg>
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
                    <h3 className="text-2xl font-bold mb-6">Indonesian Movies</h3>
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
                    <h3 className="text-2xl font-bold mb-6">K-Drama Series</h3>
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
                    <h3 className="text-2xl font-bold mb-6">Anime Collection</h3>
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
  );
}
