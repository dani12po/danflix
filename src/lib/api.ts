export interface Film {
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
  episodes?: Episode[];
  playerUrl?: string;
}

export interface Episode {
  id: string;
  title: string;
  season: number;
  episode: number;
  url?: string;
}

export interface ApiResponse {
  success: boolean;
  items: Film[];
  page: number;
  hasMore: boolean;
}

export interface DetailResponse {
  success: boolean;
  item: Film & {
    description: string;
    seasons?: number;
    episodes?: Episode[];
    playerUrl?: string;
  };
}

const BASE_URL = 'https://zeldvorik.ru/apiv3/api.php';

export class ApiService {
  private static async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes cache
          return data;
        }
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
    
    return data;
  }

  static async getTrending(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=trending&page=${page}`,
      `trending-${page}`
    );
  }

  static async getIndonesianMovies(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=indonesian-movies&page=${page}`,
      `indonesian-movies-${page}`
    );
  }

  static async getIndonesianDrama(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=indonesian-drama&page=${page}`,
      `indonesian-drama-${page}`
    );
  }

  static async getKdrama(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=kdrama&page=${page}`,
      `kdrama-${page}`
    );
  }

  static async getShortTV(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=short-tv&page=${page}`,
      `short-tv-${page}`
    );
  }

  static async getAnime(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=anime&page=${page}`,
      `anime-${page}`
    );
  }

  static async search(query: string, page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=search&q=${encodeURIComponent(query)}&page=${page}`,
      `search-${query}-${page}`
    );
  }

  static async getDetail(detailPath: string): Promise<DetailResponse> {
    return this.fetchWithCache<DetailResponse>(
      `${BASE_URL}?action=detail&detailPath=${encodeURIComponent(detailPath)}`,
      `detail-${detailPath}`
    );
  }

  static clearCache(): void {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('trending-') || 
            key.startsWith('indonesian-') || 
            key.startsWith('kdrama-') || 
            key.startsWith('short-tv-') || 
            key.startsWith('anime-') || 
            key.startsWith('search-') || 
            key.startsWith('detail-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}
