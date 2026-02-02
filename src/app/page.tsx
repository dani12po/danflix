'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { ContentGrid } from '@/components/ContentGrid';
import { ApiService, Film } from '@/lib/api';

export default function Home() {
  const [trending, setTrending] = useState<Film[]>([]);
  const [indonesianMovies, setIndonesianMovies] = useState<Film[]>([]);
  const [kdrama, setKdrama] = useState<Film[]>([]);
  const [anime, setAnime] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Film[]>([]);
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
      const searchResults = await ApiService.search(query, 1);
      setSearchResults(searchResults.items);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  } as const;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Search Results */}
      {isSearching || searchResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-24"
        >
          <ContentGrid
            title={`Search Results for "${searchQuery}"`}
            films={searchResults}
            loading={isSearching}
            error={error || undefined}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          {trending.length > 0 && (
            <HeroSlider films={trending.slice(0, 5)} />
          )}

          {/* Content Sections */}
          <div className="space-y-0">
            {indonesianMovies.length > 0 && (
              <ContentGrid
                title="Indonesian Movies"
                films={indonesianMovies}
                loading={loading}
                error={error || undefined}
                onRefresh={() => {
                  ApiService.getIndonesianMovies(1).then(data => setIndonesianMovies(data.items));
                }}
              />
            )}

            {kdrama.length > 0 && (
              <ContentGrid
                title="K-Drama"
                films={kdrama}
                loading={loading}
                error={error || undefined}
                onRefresh={() => {
                  ApiService.getKdrama(1).then(data => setKdrama(data.items));
                }}
              />
            )}

            {anime.length > 0 && (
              <ContentGrid
                title="Anime"
                films={anime}
                loading={loading}
                error={error || undefined}
                onRefresh={() => {
                  ApiService.getAnime(1).then(data => setAnime(data.items));
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
