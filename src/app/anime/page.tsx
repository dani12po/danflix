'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiService } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Play, Star, Calendar, Clock, Film as FilmIcon, Tv, Monitor, Eye, TrendingUp, Filter, Grid, List, Search, X } from 'lucide-react';

interface Anime {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: string;
  type: 'anime' | 'movie' | 'tv';
  genre: string;
  detailPath: string;
  description?: string;
  episodes?: number;
  seasons?: number;
  playerUrl?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  language?: string;
  country?: string;
  status?: 'ongoing' | 'completed';
}

interface Filters {
  genre: string;
  year: string;
  rating: string;
  sortBy: string;
}

export default function AnimePage() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'rating'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'
  ];

  const years = [
    '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'
  ];

  const ratings = [
    { label: 'All Ratings', value: '' },
    { label: '9.0+', value: '9' },
    { label: '8.0+', value: '8' },
    { label: '7.0+', value: '7' },
    { label: '6.0+', value: '6' }
  ];

  const sortOptions = [
    { label: 'Rating', value: 'rating' },
    { label: 'Latest', value: 'year' },
    { label: 'Title', value: 'title' },
    { label: 'Episodes', value: 'episodes' }
  ];

  useEffect(() => {
    loadAnime();
  }, [filters, currentPage]);

  const loadAnime = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get anime data from API
      const animeData = await ApiService.getAnime(currentPage);
      
      // Filter and sort anime
      let filteredAnime = animeData.items.filter(item => {
        // Check if it's anime type or has anime in genre
        const isAnimeType = (item.type as any) === 'anime';
        const hasAnimeInGenre = item.genre.toLowerCase().includes('anime');
        return isAnimeType || hasAnimeInGenre;
      });

      // Apply filters
      if (filters.genre) {
        filteredAnime = filteredAnime.filter(item => 
          item.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
      }

      if (filters.year) {
        filteredAnime = filteredAnime.filter(item => item.year === filters.year);
      }

      if (filters.rating) {
        filteredAnime = filteredAnime.filter(item => item.rating >= parseFloat(filters.rating));
      }

      // Apply search
      if (searchQuery) {
        filteredAnime = filteredAnime.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort
      switch (filters.sortBy) {
        case 'rating':
          filteredAnime.sort((a, b) => b.rating - a.rating);
          break;
        case 'year':
          filteredAnime.sort((a, b) => b.year.localeCompare(a.year));
          break;
        case 'title':
          filteredAnime.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'episodes':
          filteredAnime.sort((a, b) => (b.episodes || 0) - (a.episodes || 0));
          break;
      }

      // Set hasMore based on API response
      setHasMore(animeData.items.length > 0 && currentPage < 10);

      if (currentPage === 1) {
        setAnime(filteredAnime);
      } else {
        setAnime(prev => [...prev, ...filteredAnime]);
      }
    } catch (err) {
      setError('Failed to load anime. Please try again.');
      console.error('Error loading anime:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimeClick = (animeItem: Anime) => {
    // Navigate to anime detail page
    window.location.href = `/anime/${animeItem.id}`;
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sortBy: 'rating'
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="layout-section">
        <div className="container">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
                Anime Collection
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore our extensive collection of anime series and movies
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="layout-section-compact">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {(filters.genre || filters.year || filters.rating) && (
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {(filters.genre || filters.year || filters.rating) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.genre && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Genre: {filters.genre}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, genre: '' }))}
                    className="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.year && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Year: {filters.year}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, year: '' }))}
                    className="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Rating: {filters.rating}+
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, rating: '' }))}
                    className="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm hover:bg-red-500/30"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {ratings.map(rating => (
                      <option key={rating.value} value={rating.value}>{rating.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Anime Grid/List */}
      <section className="layout-section-compact">
        <div className="container">
          {loading && currentPage === 1 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading amazing anime...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <FilmIcon className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">{error}</p>
                </div>
                <button 
                  onClick={loadAnime}
                  className="btn-primary mt-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : anime.length === 0 ? (
            <div className="text-center py-20">
              <FilmIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No anime found</h3>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid-auto">
                  {anime.map((animeItem, index) => (
                    <motion.div
                      key={animeItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleAnimeClick(animeItem)}
                      className="film-card cursor-pointer"
                    >
                      <div className="film-poster bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <Tv className="w-12 h-12 text-purple-400" />
                      </div>
                      <div className="film-info">
                        <h3 className="film-title">{animeItem.title}</h3>
                        <div className="film-meta">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{animeItem.rating}</span>
                          <span>•</span>
                          <span>{animeItem.year}</span>
                          {animeItem.episodes && (
                            <>
                              <span>•</span>
                              <span>{animeItem.episodes} eps</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {anime.map((animeItem, index) => (
                    <motion.div
                      key={animeItem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleAnimeClick(animeItem)}
                      className="card cursor-pointer flex items-center space-x-4 p-4"
                    >
                      <div className="w-20 h-28 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Tv className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{animeItem.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{animeItem.rating}</span>
                          </div>
                          <span>{animeItem.year}</span>
                          {animeItem.episodes && <span>{animeItem.episodes} episodes</span>}
                        </div>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">{animeItem.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Play className="w-8 h-8 text-purple-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="btn-primary btn-lg"
                  >
                    {loading ? 'Loading...' : 'Load More Anime'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
