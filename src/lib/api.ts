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

  // Mock data for testing
  private static getMockFilms(): Film[] {
    return [
      {
        id: '1',
        title: 'The Matrix',
        poster: 'https://picsum.photos/300/450?random=1',
        rating: 8.7,
        year: '1999',
        type: 'movie',
        genre: 'Sci-Fi',
        detailPath: '/movie/the-matrix',
        description: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.'
      },
      {
        id: '2',
        title: 'Inception',
        poster: 'https://picsum.photos/300/450?random=2',
        rating: 8.8,
        year: '2010',
        type: 'movie',
        genre: 'Sci-Fi',
        detailPath: '/movie/inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
      },
      {
        id: '3',
        title: 'Stranger Things',
        poster: 'https://picsum.photos/300/450?random=3',
        rating: 8.7,
        year: '2016',
        type: 'tv',
        genre: 'Drama',
        detailPath: '/series/stranger-things',
        description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.'
      },
      {
        id: '4',
        title: 'Attack on Titan',
        poster: 'https://picsum.photos/300/450?random=4',
        rating: 9.0,
        year: '2013',
        type: 'tv',
        genre: 'Anime',
        detailPath: '/anime/attack-on-titan',
        description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.'
      },
      {
        id: '5',
        title: 'The Dark Knight',
        poster: 'https://picsum.photos/300/450?random=5',
        rating: 9.0,
        year: '2008',
        type: 'movie',
        genre: 'Action',
        detailPath: '/movie/the-dark-knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
      },
      {
        id: '6',
        title: 'Breaking Bad',
        poster: 'https://picsum.photos/300/450?random=6',
        rating: 9.5,
        year: '2008',
        type: 'tv',
        genre: 'Drama',
        detailPath: '/series/breaking-bad',
        description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.'
      }
    ];
  }

  static async getTrending(page: number = 1): Promise<ApiResponse> {
    // Use mock data for now
    const mockFilms = this.getMockFilms();
    return {
      success: true,
      items: mockFilms,
      page,
      hasMore: false
    };
  }

  static async getIndonesianMovies(page: number = 1): Promise<ApiResponse> {
    const mockFilms = this.getMockFilms().filter(film => film.title.includes('Matrix') || film.title.includes('Inception'));
    return {
      success: true,
      items: mockFilms,
      page,
      hasMore: false
    };
  }

  static async getKdrama(page: number = 1): Promise<ApiResponse> {
    const mockFilms = this.getMockFilms().filter(film => film.genre === 'Drama');
    return {
      success: true,
      items: mockFilms,
      page,
      hasMore: false
    };
  }

  static async getAnime(page: number = 1): Promise<ApiResponse> {
    const mockFilms = this.getMockFilms().filter(film => film.genre === 'Anime');
    return {
      success: true,
      items: mockFilms,
      page,
      hasMore: false
    };
  }

  static async getShortTV(page: number = 1): Promise<ApiResponse> {
    return this.fetchWithCache<ApiResponse>(
      `${BASE_URL}?action=short-tv&page=${page}`,
      `short-tv-${page}`
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
