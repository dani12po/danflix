'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiService } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Play, Star, Calendar, Filter, ChevronDown, Grid, List, Search, X } from 'lucide-react';

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

interface Filters {
  genre: string;
  year: string;
  rating: string;
  sortBy: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    genre: 'all',
    year: 'all',
    rating: 'all',
    sortBy: 'trending'
  });

  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'drama', label: 'Drama' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'horror', label: 'Horror' },
    { value: 'animation', label: 'Animation' },
    { value: 'documentary', label: 'Documentary' }
  ];

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: 'older', label: '2020 and Older' }
  ];

  const ratings = [
    { value: 'all', label: 'All Ratings' },
    { value: '9+', label: '9.0+ Rating' },
    { value: '8+', label: '8.0+ Rating' },
    { value: '7+', label: '7.0+ Rating' },
    { value: '6+', label: '6.0+ Rating' }
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' }
  ];

  useEffect(() => {
    loadMovies();
  }, [filters, currentPage]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get Indonesian movies as base
      const response = await ApiService.getIndonesianMovies(currentPage);
      
      // Apply filters
      let filteredMovies = response.items;

      // Genre filter
      if (filters.genre !== 'all') {
        filteredMovies = filteredMovies.filter(movie => 
          movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
      }

      // Year filter
      if (filters.year !== 'all') {
        if (filters.year === 'older') {
          filteredMovies = filteredMovies.filter(movie => 
            parseInt(movie.year) < 2020
          );
        } else {
          filteredMovies = filteredMovies.filter(movie => 
            movie.year === filters.year
          );
        }
      }

      // Rating filter
      if (filters.rating !== 'all') {
        const minRating = parseFloat(filters.rating.replace('+', ''));
        filteredMovies = filteredMovies.filter(movie => 
          movie.rating >= minRating
        );
      }

      // Sort
      switch (filters.sortBy) {
        case 'rating':
          filteredMovies.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredMovies.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case 'oldest':
          filteredMovies.sort((a, b) => parseInt(a.year) - parseInt(b.year));
          break;
        case 'title':
          filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }

      // Search filter
      if (searchQuery) {
        filteredMovies = filteredMovies.filter(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setMovies(filteredMovies);
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFilmClick = (film: Film) => {
    window.location.href = `/movie/${film.id}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-950" />
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
          </div>
        </div>
        
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="hero-title">Movies</h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hero-subtitle"
            >
              Discover amazing movies from around the world
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white/10 border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 glass-dark rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {genres.map(genre => (
                      <option key={genre.value} value={genre.value} className="bg-slate-800">
                        {genre.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {years.map(year => (
                      <option key={year.value} value={year.value} className="bg-slate-800">
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {ratings.map(rating => (
                      <option key={rating.value} value={rating.value} className="bg-slate-800">
                        {rating.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-slate-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Movies Grid/List */}
      <section className="py-8">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading movies...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <p className="text-xl font-semibold">{error}</p>
                </div>
                <button 
                  onClick={loadMovies}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : movies.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setFilters({
                      genre: 'all',
                      year: 'all',
                      rating: 'all',
                      sortBy: 'trending'
                    });
                    setSearchQuery('');
                  }}
                  className="btn-secondary mt-4"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-400">
                  {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
                </p>
              </div>

              {/* Movies Display */}
              {viewMode === 'grid' ? (
                <div className="film-grid">
                  {movies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleFilmClick(movie)}
                      className="film-card cursor-pointer"
                    >
                      <div className="film-poster bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <Play className="w-12 h-12 text-purple-400" />
                      </div>
                      <div className="film-info">
                        <h3 className="film-title">{movie.title}</h3>
                        <div className="film-meta">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{movie.rating}</span>
                          <span>•</span>
                          <span>{movie.year}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{movie.genre}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {movies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleFilmClick(movie)}
                      className="card cursor-pointer"
                    >
                      <div className="flex gap-6">
                        <div className="w-32 h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Play className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{movie.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{movie.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span>{movie.genre}</span>
                          </div>
                          <p className="text-gray-400 line-clamp-2">
                            {movie.description || 'No description available.'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Play className="w-8 h-8 text-purple-400" />
                        </div>
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
                    className="btn-primary"
                  >
                    {loading ? 'Loading...' : 'Load More Movies'}
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
