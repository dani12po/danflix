'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ApiService, Film } from '@/lib/api';
import Navigation from '@/components/Navigation';
import FilmCard from '@/components/FilmCard';
import { Play, Star, Calendar, Clock, Film as FilmIcon, Tv, Monitor, Eye, TrendingUp, Filter, Grid, List, Search, X } from 'lucide-react';

export default function SeriesPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    loadSeries();
  }, [currentPage, searchQuery, selectedGenre, sortBy]);

  const loadSeries = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll filter movies for series content
      const seriesData = await ApiService.getTrending(currentPage);
      
      // Filter for TV series content
      const filteredSeries = seriesData.items.filter(item => item.type === 'tv');

      // Apply search filter
      let finalSeries = filteredSeries;
      if (searchQuery) {
        finalSeries = finalSeries.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply genre filter
      if (selectedGenre !== 'all') {
        finalSeries = finalSeries.filter(item => 
          item.genre.toLowerCase().includes(selectedGenre.toLowerCase())
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'rating':
          finalSeries.sort((a, b) => b.rating - a.rating);
          break;
        case 'year':
          finalSeries.sort((a, b) => b.year.localeCompare(a.year));
          break;
        case 'title':
          finalSeries.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'seasons':
          finalSeries.sort((a, b) => (b.seasons || 0) - (a.seasons || 0));
          break;
      }

      setHasMore(finalSeries.length > 0 && currentPage < 10);

      if (currentPage === 1) {
        setSeries(finalSeries);
      } else {
        setSeries(prev => [...prev, ...finalSeries]);
      }
    } catch (err) {
      setError('Failed to load series. Please try again.');
      console.error('Error loading series:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesClick = (seriesItem: Film) => {
    router.push(`/series/${seriesItem.id}`);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      <main className="main-content">
        {/* Header */}
        <section className="content-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TV Series
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Discover the latest and most popular TV series from around the world
              </p>
            </motion.div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search series..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all min-h-[44px]"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all min-h-[44px]"
                >
                  <option value="all">All Genres</option>
                  <option value="drama">Drama</option>
                  <option value="comedy">Comedy</option>
                  <option value="action">Action</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all min-h-[44px]"
                >
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="seasons">Seasons</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Series Grid */}
        <section className="content-section">
          <div className="container">
            {loading && currentPage === 1 ? (
              <div className="loading-container">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading series...</p>
              </div>
            ) : error ? (
              <div className="error-container text-red-500">
                <p>{error}</p>
                <button 
                  onClick={loadSeries}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full transition-colors cursor-pointer relative z-10"
                  role="button"
                  aria-label="Try loading series again"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {series.length === 0 && currentPage === 1 ? (
                  <div className="text-center text-gray-400 py-12">
                    <Tv className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-lg">No series found</p>
                    <p className="text-sm mt-2">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <>
                    <div className="film-grid">
                      {series.map((seriesItem, index) => (
                        <FilmCard
                          key={seriesItem.id}
                          film={seriesItem}
                          onClick={handleSeriesClick}
                          index={index}
                        />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="text-center mt-12">
                        <button
                          onClick={loadMore}
                          disabled={loading}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer relative z-10 min-h-[44px]"
                          role="button"
                          aria-label="Load more series"
                        >
                          {loading ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
