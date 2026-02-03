'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { User, Mail, Lock, Bell, Moon, Sun, Monitor, Check, X, Save, Eye, EyeOff } from 'lucide-react';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newReleases: boolean;
    recommendations: boolean;
    watchlistUpdates: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    autoplay: boolean;
    quality: 'auto' | 'low' | 'medium' | 'high';
    subtitles: boolean;
    subtitleLanguage: string;
  };
}

export default function Settings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'preferences'>('profile');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      newReleases: true,
      recommendations: false,
      watchlistUpdates: true
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      autoplay: true,
      quality: 'auto',
      subtitles: false,
      subtitleLanguage: 'en'
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveMessage('Settings saved successfully!');
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleProfileChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navigation />
      
      <main className="main-content">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gradient font-secondary mb-8">
              Settings
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-secondary">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`pb-3 px-4 font-medium transition-all ${
                  activeTab === 'preferences'
                    ? 'text-accent-gold border-b-2 border-accent-gold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Monitor className="w-4 h-4 inline mr-2" />
                Preferences
              </button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="card card-glass p-6">
                    <h2 className="text-xl font-bold text-gradient mb-6">Profile Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card card-glass p-6">
                    <h2 className="text-xl font-bold text-gradient mb-6">Change Password</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={settings.profile.currentPassword}
                            onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                            className="input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={settings.profile.newPassword}
                            onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                            className="input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={settings.profile.confirmPassword}
                            onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                            className="input pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="card card-glass p-6">
                  <h2 className="text-xl font-bold text-gradient mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary hover:border-accent-gold transition-colors">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-secondary">Receive updates and recommendations via email</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('emailNotifications', !settings.notifications.emailNotifications)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.emailNotifications ? 'bg-accent-gold' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                          settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary hover:border-accent-gold transition-colors">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-secondary">Get instant notifications on your device</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('pushNotifications', !settings.notifications.pushNotifications)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.pushNotifications ? 'bg-accent-gold' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                          settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary hover:border-accent-gold transition-colors">
                      <div>
                        <div className="font-medium">New Releases</div>
                        <div className="text-sm text-secondary">Notify when new movies and series are added</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('newReleases', !settings.notifications.newReleases)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.newReleases ? 'bg-accent-gold' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                          settings.notifications.newReleases ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary hover:border-accent-gold transition-colors">
                      <div>
                        <div className="font-medium">Personalized Recommendations</div>
                        <div className="text-sm text-secondary">Get content suggestions based on your viewing history</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('recommendations', !settings.notifications.recommendations)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.recommendations ? 'bg-accent-gold' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                          settings.notifications.recommendations ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-secondary hover:border-accent-gold transition-colors">
                      <div>
                        <div className="font-medium">Watchlist Updates</div>
                        <div className="text-sm text-secondary">Notify when items on your watchlist become available</div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('watchlistUpdates', !settings.notifications.watchlistUpdates)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.watchlistUpdates ? 'bg-accent-gold' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                          settings.notifications.watchlistUpdates ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="card card-glass p-6">
                    <h2 className="text-xl font-bold text-gradient mb-6">Appearance</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-3">Theme</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handlePreferenceChange('theme', 'light')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              settings.preferences.theme === 'light'
                                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                                : 'border-secondary text-secondary hover:border-primary'
                            }`}
                          >
                            <Sun className="w-4 h-4" />
                            Light
                          </button>
                          <button
                            onClick={() => handlePreferenceChange('theme', 'dark')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              settings.preferences.theme === 'dark'
                                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                                : 'border-secondary text-secondary hover:border-primary'
                            }`}
                          >
                            <Moon className="w-4 h-4" />
                            Dark
                          </button>
                          <button
                            onClick={() => handlePreferenceChange('theme', 'system')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              settings.preferences.theme === 'system'
                                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                                : 'border-secondary text-secondary hover:border-primary'
                            }`}
                          >
                            <Monitor className="w-4 h-4" />
                            System
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Language</label>
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="input"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="ja">日本語</option>
                          <option value="ko">한국어</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="card card-glass p-6">
                    <h2 className="text-xl font-bold text-gradient mb-6">Playback</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-secondary">
                        <div>
                          <div className="font-medium">Autoplay</div>
                          <div className="text-sm text-secondary">Automatically play next episode</div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('autoplay', !settings.preferences.autoplay)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.preferences.autoplay ? 'bg-accent-gold' : 'bg-secondary'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                            settings.preferences.autoplay ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Video Quality</label>
                        <select
                          value={settings.preferences.quality}
                          onChange={(e) => handlePreferenceChange('quality', e.target.value)}
                          className="input"
                        >
                          <option value="auto">Auto</option>
                          <option value="low">Low (360p)</option>
                          <option value="medium">Medium (720p)</option>
                          <option value="high">High (1080p)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-secondary">
                        <div>
                          <div className="font-medium">Subtitles</div>
                          <div className="text-sm text-secondary">Show subtitles by default</div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('subtitles', !settings.preferences.subtitles)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.preferences.subtitles ? 'bg-accent-gold' : 'bg-secondary'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-primary rounded-full transition-transform ${
                            settings.preferences.subtitles ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>

                      {settings.preferences.subtitles && (
                        <div>
                          <label className="block text-sm font-medium text-secondary mb-2">Subtitle Language</label>
                          <select
                            value={settings.preferences.subtitleLanguage}
                            onChange={(e) => handlePreferenceChange('subtitleLanguage', e.target.value)}
                            className="input"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                            <option value="ko">한국어</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-between mt-8">
                {saveMessage && (
                  <div className="flex items-center gap-2 text-accent-gold">
                    <Check className="w-4 h-4" />
                    <span>{saveMessage}</span>
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary ml-auto"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
