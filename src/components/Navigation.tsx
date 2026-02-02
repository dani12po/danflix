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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: any) => {
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
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Navigate to the page
    router.push(href);
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className={`header z-header ${isScrolled ? 'glass-dark border-b border-white/10' : 'bg-transparent'}`}>
        <div className="header-content">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2 group cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all min-h-[44px] min-w-[44px] text-overflow-fix"
            aria-label="StreamFlix Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block whitespace-nowrap">
              StreamFlix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 z-button" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] relative z-10 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative" role="search">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search movies, series, anime..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200 relative z-10 min-h-[44px] text-overflow-fix"
                  aria-label="Search content"
                />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-4 z-button">
            <button 
              onClick={() => router.push('/profile')}
              className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] relative z-10 flex items-center justify-center"
              aria-label="User profile"
            >
              <User className="w-5 h-5 flex-shrink-0" />
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] relative z-10 flex items-center justify-center"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] relative z-10 flex items-center justify-center"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6 flex-shrink-0" /> : <Menu className="w-6 h-6 flex-shrink-0" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Fixed positioning to not cover content */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-modal transition-all duration-300">
          <div 
            className="absolute inset-0 bg-black/80 transition-opacity duration-300" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close mobile menu"
          />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] mobile-menu transform transition-transform duration-300 overflow-y-auto">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  StreamFlix
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="mobile-close-button"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
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
                      className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] relative z-10 whitespace-nowrap ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      aria-label={`Navigate to ${item.label}`}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Mobile Search */}
            <div className="mobile-search">
              <form onSubmit={handleSearch} className="relative" role="search">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search movies, series, anime..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200 relative z-10 min-h-[44px] text-overflow-fix"
                    aria-label="Search content"
                  />
                </div>
              </form>
            </div>

            {/* Mobile User Menu */}
            <div className="mobile-user-menu">
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] relative z-10 whitespace-nowrap"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] relative z-10 whitespace-nowrap"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Handle logout logic here
                    console.log('Logout clicked');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer min-h-[44px] relative z-10 whitespace-nowrap"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
