'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { User, Mail, Calendar, Clock, Star, Film, Tv, Gamepad2, Settings, LogOut, Edit2, Check, X, Play } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  watchTime: string;
  favoriteGenre: string;
  watchedCount: number;
  watchlistCount: number;
}

interface WatchHistory {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  rating: number;
  watchedAt: string;
  duration: string;
}

interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  rating: number;
  year: string;
  addedAt: string;
}

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'history' | 'watchlist'>('history');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://picsum.photos/150/150?random=avatar',
    joinDate: 'January 2024',
    watchTime: '248 hours',
    favoriteGenre: 'Action',
    watchedCount: 156,
    watchlistCount: 42
  });
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([
    {
      id: '1',
      title: 'The Matrix',
      poster: 'https://picsum.photos/300/450?random=1',
      type: 'movie',
      rating: 8.7,
      watchedAt: '2 hours ago',
      duration: '2h 16m'
    },
    {
      id: '2',
      title: 'Stranger Things',
      poster: 'https://picsum.photos/300/450?random=2',
      type: 'tv',
      rating: 8.7,
      watchedAt: '1 day ago',
      duration: '45m'
    },
    {
      id: '3',
      title: 'Inception',
      poster: 'https://picsum.photos/300/450?random=3',
      type: 'movie',
      rating: 8.8,
      watchedAt: '3 days ago',
      duration: '2h 28m'
    }
  ]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      id: '4',
      title: 'The Dark Knight',
      poster: 'https://picsum.photos/300/450?random=4',
      type: 'movie',
      rating: 9.0,
      year: '2008',
      addedAt: '1 week ago'
    },
    {
      id: '5',
      title: 'Breaking Bad',
      poster: 'https://picsum.photos/300/450?random=5',
      type: 'tv',
      rating: 9.5,
      year: '2008',
      addedAt: '2 weeks ago'
    }
  ]);

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navigation />
      
      <main className="main-content">
        <div className="content-section">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="card-glass p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-accent-gold shadow-gold"
                  />
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-dark" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editProfile.name}
                        onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                        className="input text-2xl font-bold text-center md:text-left"
                      />
                      <input
                        type="email"
                        value={editProfile.email}
                        onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                        className="input text-center md:text-left"
                      />
                      <div className="flex gap-3 justify-center md:justify-start">
                        <button
                          onClick={handleSaveProfile}
                          className="btn btn-primary"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-secondary"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gradient font-secondary mb-2">
                        {profile.name}
                      </h1>
                      <div className="flex items-center gap-2 text-secondary mb-4 justify-center md:justify-start">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-accent-gold" />
                          <span>Joined {profile.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-accent-gold" />
                          <span>{profile.watchTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-accent-gold" />
                          <span>{profile.favoriteGenre}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-secondary mt-4"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">{profile.watchedCount}</div>
                    <div className="text-sm text-secondary">Movies Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">{profile.watchlistCount}</div>
                    <div className="text-sm text-secondary">Watchlist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('history')}
                className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Clock className="w-4 h-4" />
                Watch History
              </button>
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`btn ${activeTab === 'watchlist' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Star className="w-4 h-4" />
                Watchlist
              </button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'history' ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gradient mb-6">Recent Watch History</h2>
                  {watchHistory.map((item) => (
                    <div key={item.id} className="card card-glass p-4 hover:shadow-gold transition-all">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-16 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-secondary">
                            <div className="flex items-center gap-1">
                              {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                              <span>{item.type === 'movie' ? 'Movie' : 'TV Series'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-accent-gold" />
                              <span>{item.rating}</span>
                            </div>
                            <span>{item.watchedAt}</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        <button className="btn btn-ghost">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gradient mb-6">My Watchlist</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {watchlist.map((item) => (
                      <div key={item.id} className="card card-glass overflow-hidden group">
                        <div className="relative aspect-[2/3]">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-2 left-2 right-2">
                              <button
                                onClick={() => removeFromWatchlist(item.id)}
                                className="btn btn-ghost w-full"
                              >
                                <X className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-primary mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center justify-between text-xs text-secondary">
                            <span>{item.year}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-accent-gold" />
                              <span>{item.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
