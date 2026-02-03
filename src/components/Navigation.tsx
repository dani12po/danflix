'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Home, Film, Tv, Gamepad2, User, Settings, LogOut } from 'lucide-react';

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export default function Navigation({ onSearch }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/series', label: 'Series', icon: Tv },
    { href: '/anime', label: 'Anime', icon: Gamepad2 },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Navigation Bar - Enhanced with New Theme */}
      <header className={`header z-header ${isScrolled ? 'glass-dark' : ''}`}>
        <div className="header-content">
          {/* Logo - Enhanced */}
          <Link 
            href="/"
            className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/10 transition-all min-h-[48px] text-overflow-fix"
            aria-label="StreamFlix Home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
              <Film className="w-6 h-6 text-primary-dark" />
            </div>
            <span className="text-2xl font-black text-gradient hidden sm:block whitespace-nowrap font-secondary">
              StreamFlix
            </span>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all cursor-pointer min-h-[48px] whitespace-nowrap font-medium ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-accent-gold/20 to-accent-gold-dark/20 text-accent-gold border border-accent-gold/30'
                      : 'text-secondary hover:text-primary hover:bg-white/10'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Enhanced */}
          <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative" role="search">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series, anime..."
                  className="input pl-12 pr-4 bg-surface border-secondary"
                  aria-label="Search content"
                />
              </div>
            </form>
          </div>

          {/* User Menu - Enhanced */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => router.push('/profile')}
              className="btn btn-ghost p-3 rounded-xl hover:bg-white/10"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className="btn btn-ghost p-3 rounded-xl hover:bg-white/10"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden btn btn-ghost p-3 rounded-xl hover:bg-white/10"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Enhanced with New Theme */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-modal">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close mobile menu"
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-surface backdrop-blur-lg overflow-y-auto border-l border-gold">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-xl flex items-center justify-center shadow-gold">
                  <Film className="w-6 h-6 text-primary-dark" />
                </div>
                <span className="text-xl font-black text-gradient font-secondary">
                  StreamFlix
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-ghost p-2 rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleNavClick(item.href);
                      }}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all cursor-pointer min-h-[48px] whitespace-nowrap font-medium ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-accent-gold/20 to-accent-gold-dark/20 text-accent-gold border border-accent-gold/30'
                          : 'text-secondary hover:text-primary hover:bg-white/10'
                      }`}
                      aria-label={`Navigate to ${item.label}`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Search */}
              <div className="mt-6">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, series, anime..."
                      className="input pl-12 pr-4 bg-surface-light border-secondary"
                      aria-label="Search content"
                    />
                  </div>
                </form>
              </div>

              {/* User Actions */}
              <div className="mt-6 space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all cursor-pointer min-h-[48px] whitespace-nowrap font-medium text-secondary hover:text-primary hover:bg-white/10"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all cursor-pointer min-h-[48px] whitespace-nowrap font-medium text-secondary hover:text-primary hover:bg-white/10"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
