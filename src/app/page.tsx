'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiService, Film } from '@/lib/api';

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-slate-950" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              StreamFlix
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Watch Movies & Series Online
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Start Watching
            </motion.button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
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
              <section>
                <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {trending.map((film) => (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ y: -8 }}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      <div className="aspect-[2/3] bg-slate-700"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white truncate">{film.title}</h3>
                        <p className="text-gray-400 text-sm">{film.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {indonesianMovies.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Indonesian Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {indonesianMovies.map((film) => (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8 }}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      <div className="aspect-[2/3] bg-slate-700"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white truncate">{film.title}</h3>
                        <p className="text-gray-400 text-sm">{film.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {kdrama.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">K-Drama</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {kdrama.map((film) => (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8 }}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      <div className="aspect-[2/3] bg-slate-700"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white truncate">{film.title}</h3>
                        <p className="text-gray-400 text-sm">{film.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {anime.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Anime</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {anime.map((film) => (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -8 }}
                      className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      <div className="aspect-[2/3] bg-slate-700"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white truncate">{film.title}</h3>
                        <p className="text-gray-400 text-sm">{film.year}</p>
                      </div>
                    </motion.div>
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
