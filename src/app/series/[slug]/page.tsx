'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api';
import Navigation from '@/components/Navigation';
import { Play, Star, Calendar, Clock, Film as FilmIcon, ArrowLeft, Share2, Heart, Plus, Download, ChevronRight, Users, ThumbsUp, MessageSquare, List, CheckCircle, PlayCircle, Tv, Monitor, Eye } from 'lucide-react';

interface Series {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: string;
  type: 'tv' | 'series';
  genre: string;
  detailPath: string;
  description?: string;
  seasons: number;
  episodes?: Episode[];
  playerUrl?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  language?: string;
  country?: string;
  status?: 'ongoing' | 'completed';
  totalEpisodes?: number;
}

interface Episode {
  id: string;
  title: string;
  season: number;
  episode: number;
  url?: string;
  duration?: string;
  airDate?: string;
  thumbnail?: string;
  description?: string;
  watched?: boolean;
  watchProgress?: number;
}

interface Season {
  season: number;
  title: string;
  episodeCount: number;
  episodes: Episode[];
  watchedEpisodes: number;
}

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [series, setSeries] = useState<Series | null>(null);
  const [relatedSeries, setRelatedSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if (slug) {
      loadSeriesDetails();
    }
  }, [slug]);

  const loadSeriesDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock series data for demo - replace with actual API call
      const mockSeries: Series = {
        id: slug,
        title: decodeURIComponent(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        poster: `/api/placeholder/400/600`,
        rating: 9.2,
        year: '2024',
        type: 'tv',
        genre: 'Drama, Thriller, Mystery',
        detailPath: slug,
        description: 'An epic television series that takes you on an unforgettable journey through stunning visuals and compelling narrative. This masterpiece combines cutting-edge cinematography with powerful performances to create a truly immersive experience that will leave you breathless from start to finish.',
        seasons: 4,
        totalEpisodes: 48,
        status: 'ongoing',
        duration: '45min per episode',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Tom Hardy', 'Anne Hathaway', 'Michael Caine'],
        language: 'English',
        country: 'United States',
        playerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };

      // Generate mock seasons and episodes
      const mockSeasons: Season[] = [];
      for (let season = 1; season <= mockSeries.seasons; season++) {
        const episodes: Episode[] = [];
        const episodesInSeason = 12; // 12 episodes per season
        
        for (let episode = 1; episode <= episodesInSeason; episode++) {
          const watched = Math.random() > 0.7; // 30% watched
          episodes.push({
            id: `${mockSeries.id}-s${season}e${episode}`,
            title: `Episode ${episode}: ${season === 1 ? 'The Beginning' : season === 2 ? 'The Journey Continues' : season === 3 ? 'The Revelation' : 'The Finale'}`,
            season: season,
            episode: episode,
            duration: '45min',
            airDate: `2024-${String(season).padStart(2, '0')}-${String(episode).padStart(2, '0')}`,
            description: `Episode ${episode} of Season ${season}`,
            watched: watched,
            watchProgress: watched ? 100 : Math.floor(Math.random() * 80)
          });
        }
        
        mockSeasons.push({
          season: season,
          title: `Season ${season}`,
          episodeCount: episodesInSeason,
          episodes: episodes,
          watchedEpisodes: episodes.filter(ep => ep.watched).length
        });
      }

      setSeries(mockSeries);
      setSeasons(mockSeasons);
      setCurrentEpisode(mockSeasons[0]?.episodes[0] || null);

      // Load related series
      const kdramaData = await ApiService.getKdrama(1);
      setRelatedSeries(kdramaData.items.slice(0, 6).map(item => ({
        ...item,
        type: 'tv' as const,
        seasons: (item as any).seasons || 2,
        totalEpisodes: (item as any).totalEpisodes || 12,
        status: 'ongoing' as const
      })));

    } catch (err) {
      setError('Failed to load series details. Please try again.');
      console.error('Error loading series:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (episode?: Episode) => {
    const episodeToPlay = episode || currentEpisode;
    if (episodeToPlay) {
      setCurrentEpisode(episodeToPlay);
      setIsPlaying(true);
    }
  };

  const handleTrailer = () => {
    setShowTrailer(true);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    const seasonData = seasons.find(s => s.season === season);
    if (seasonData) {
      setCurrentEpisode(seasonData.episodes[0]);
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    setCurrentEpisode(episode);
    // Mark episode as watched
    const updatedSeasons = seasons.map(season => {
      if (season.season === episode.season) {
        return {
          ...season,
          episodes: season.episodes.map(ep => 
            ep.id === episode.id ? { ...ep, watched: true, watchProgress: 100 } : ep
          ),
          watchedEpisodes: season.episodes.filter(ep => ep.watched || ep.id === episode.id).length
        };
      }
      return season;
    });
    setSeasons(updatedSeasons);
  };

  const handleShareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing series: ${series?.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const getSeasonProgress = (season: Season) => {
    return (season.watchedEpisodes / season.episodeCount) * 100;
  };

  const getTotalProgress = () => {
    const totalEpisodes = seasons.reduce((acc, season) => acc + season.episodeCount, 0);
    const totalWatched = seasons.reduce((acc, season) => acc + season.watchedEpisodes, 0);
    return totalEpisodes > 0 ? (totalWatched / totalEpisodes) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navigation />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FilmIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">{error || 'Series not found'}</p>
            </div>
            <button 
              onClick={handleBack}
              className="btn-primary mt-4"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSeasonData = seasons.find(s => s.season === selectedSeason) || seasons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      
      {/* Hero Section with Series Background */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-slate-900/90 to-slate-950" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
        </div>

        {/* Series Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Series Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                <div className="relative group">
                  <div className="aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-purple-500/20">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <Tv className="w-24 h-24 text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleTrailer}
                      className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Series Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {/* Back Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Browse</span>
                </motion.button>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {series.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-semibold">{series.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{series.year}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300 capitalize">{series.type}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{series.genre}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{series.seasons} Seasons</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{series.totalEpisodes} Episodes</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {series.description}
                </p>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-white font-medium capitalize">{series.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-medium">{series.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Language</p>
                    <p className="text-white font-medium">{series.language}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Country</p>
                    <p className="text-white font-medium">{series.country}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlay()}
                    className="flex items-center space-x-2 btn-primary text-lg px-8 py-4"
                  >
                    <Play className="w-6 h-6" />
                    <span>Play Now</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTrailer}
                    className="flex items-center space-x-2 btn-secondary text-lg px-8 py-4"
                  >
                    <FilmIcon className="w-6 h-6" />
                    <span>Trailer</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWatchlist}
                    className={`flex items-center space-x-2 btn-secondary text-lg px-8 py-4 ${isInWatchlist ? 'bg-purple-600' : ''}`}
                  >
                    <Plus className="w-6 h-6" />
                    <span>{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center space-x-2 btn-secondary text-lg px-8 py-4"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>Share</span>
                  </motion.button>
                </div>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-800 border border-purple-500/20 rounded-lg p-4 mb-8"
                    >
                      <p className="text-sm text-gray-400 mb-2">Share this series:</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleShareToSocial('facebook')}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                        >
                          Facebook
                        </button>
                        <button 
                          onClick={() => handleShareToSocial('twitter')}
                          className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-sm"
                        >
                          Twitter
                        </button>
                        <button 
                          onClick={() => handleShareToSocial('whatsapp')}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      <AnimatePresence>
        {(isPlaying || showTrailer) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="relative w-full max-w-6xl mx-4">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setShowTrailer(false);
                }}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                Close Player
              </button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={series.playerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Series Progress Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Progress
            </h2>
            <div className="text-gray-400">
              {seasons.reduce((acc, season) => acc + season.watchedEpisodes, 0)} of {series.totalEpisodes} episodes watched
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Total Progress</span>
              <span>{Math.round(getTotalProgress())}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getTotalProgress()}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seasons and Episodes Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Episodes
          </h2>
          
          {/* Season Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {seasons.map((season) => (
              <button
                key={season.season}
                onClick={() => handleSeasonChange(season.season)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedSeason === season.season
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{season.title}</span>
                  <span className="text-sm opacity-75">
                    ({season.watchedEpisodes}/{season.episodeCount})
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Season Progress */}
          {currentSeasonData && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{currentSeasonData.title} Progress</span>
                <span>{Math.round(getSeasonProgress(currentSeasonData))}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getSeasonProgress(currentSeasonData)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}

          {/* Episodes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSeasonData?.episodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleEpisodeClick(episode)}
                className="card cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Episode Thumbnail */}
                  <div className="w-24 h-16 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    {episode.watched ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <PlayCircle className="w-8 h-8 text-purple-400" />
                    )}
                  </div>
                  
                  {/* Episode Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{episode.title}</h3>
                      {episode.watched && (
                        <Eye className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                      <span>Episode {episode.episode}</span>
                      <span>•</span>
                      <span>{episode.duration}</span>
                      <span>•</span>
                      <span>{episode.airDate}</span>
                    </div>
                    
                    {episode.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {episode.description}
                      </p>
                    )}
                    
                    {/* Watch Progress */}
                    {episode.watchProgress && episode.watchProgress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-slate-700 rounded-full h-1">
                          <div 
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${episode.watchProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Interaction Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Rate this series:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="text-2xl transition-colors"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= userRating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-600 hover:text-yellow-400'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-gray-400">({userRating}/5)</span>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-5 h-5" />
                  <span>3.2k</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-5 h-5" />
                  <span>856</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>25.8k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Series Section */}
      {relatedSeries.length > 0 && (
        <section className="py-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Related Series
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {relatedSeries.map((relatedSeries, index) => (
                  <motion.div
                    key={relatedSeries.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/series/${relatedSeries.id}`)}
                    className="cursor-pointer"
                  >
                    <div className="film-card">
                      <div className="film-poster bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                        <Tv className="w-12 h-12 text-purple-400" />
                      </div>
                      <div className="film-info">
                        <h3 className="film-title">{relatedSeries.title}</h3>
                        <div className="film-meta">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{relatedSeries.rating}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {relatedSeries.seasons} Seasons
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
