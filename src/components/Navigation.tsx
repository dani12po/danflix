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
            className="flex items-center space-x-2 group cursor-pointer"
            aria-label="StreamFlix Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              StreamFlix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px] ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative" role="search">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : 'scale-100'
              }`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search movies, series, anime..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200 relative z-10 min-h-[44px]"
                  aria-label="Search content"
                />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={() => router.push('/profile')}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="User profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Fixed positioning to not cover content */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-modal transition-all duration-300">
          <div 
            className="absolute inset-0 bg-black/80 transition-opacity duration-300" 
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close mobile menu overlay"
          />
          
          <div className="absolute top-0 right-0 h-full w-80 glass-dark transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Film className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    StreamFlix
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px]"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 p-4" role="navigation" aria-label="Mobile navigation">
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
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px] min-w-[44px] ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Mobile Search */}
              <div className="p-4 border-t border-white/10">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-200 relative z-10 min-h-[44px]"
                    aria-label="Search content"
                  />
                </form>
              </div>

              {/* Mobile User Menu */}
              <div className="p-4 border-t border-white/10">
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px]"
                    aria-label="User profile"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/settings');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px]"
                    aria-label="Settings"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      // Handle logout logic here
                      console.log('Logout clicked');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 z-button cursor-pointer min-h-[44px]"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
