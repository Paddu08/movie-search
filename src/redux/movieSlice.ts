import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language?: string; // <-- Add this (optional for safety)
}

// Filter function
const applyFiltersToMovies = (movies: Movie[], filters: MovieSearchState['filters']): Movie[] => {
  return movies.filter(movie => {
    // Year filter
    const movieYear = new Date(movie.release_date).getFullYear();
    if (movieYear < filters.yearRange[0] || movieYear > filters.yearRange[1]) {
      return false;
    }
    
    // Rating filter
    if (movie.vote_average < filters.minRating) {
      return false;
    }
    
    if (filters.genre !== 'all') {
      const genreMap: { [key: string]: number } = {
        'action': 28,
        'adventure': 12,
        'animation': 16,
        'comedy': 35,
        'crime': 80,
        'documentary': 99,
        'drama': 18,
        'family': 10751,
        'fantasy': 14,
        'horror': 27,
        'mystery': 9648,
        'romance': 10749,
        'sci-fi': 878,
        'thriller': 53,
        'war': 10752,
        'western': 37
      };
      
      const targetGenreId = genreMap[filters.genre];
      if (targetGenreId && !movie.genre_ids.includes(targetGenreId)) {
        return false;
      }
    }
    
    // Language filter
    if (filters.language && filters.language !== 'all' && movie.original_language !== filters.language) {
      return false;
    }
    
    return true;
  });
};

export interface MovieSearchState {
  movies: Movie[];
  filteredMovies: Movie[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  filters: {
    yearRange: [number, number];
    minRating: number;
    genre: string;
    language?: string; // <-- Add this
  };
}

const initialState: MovieSearchState = {
  movies: [],
  filteredMovies: [],
  searchQuery: '',
  loading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
  filters: {
    yearRange: [1900, new Date().getFullYear()],
    minRating: 0,
    genre: 'all',
    language: 'all', // <-- Add this
  },
};

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      
      console.log('API Key:', API_KEY);
      console.log('Query:', query);
      console.log('Page:', page);
      
      if (!API_KEY) {
        throw new Error('API key is missing. Check your .env file.');
      }
      
      if (!query.trim()) {
        throw new Error('Search query cannot be empty');
      }
      
      const fullUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
      console.log('Full URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Log the full response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        
        if (response.status === 404) {
          throw new Error(`API endpoint not found. Check the URL: ${fullUrl}`);
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Check your .env file.');
        } else {
          throw new Error(`API error ${response.status}: ${errorData.status_message || 'Unknown error'}`);
        }
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      
      // Log first movie to see genre data structure
      if (data.results && data.results.length > 0) {
        console.log('First movie data:', data.results[0]);
        console.log('Genre IDs:', data.results[0].genre_ids);
      }
      
      return {
        movies: data.results,
        totalResults: data.total_results,
        page: data.page,
      };
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.movies = [];
      state.searchQuery = '';
      state.error = null;
      state.totalResults = 0;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<MovieSearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters immediately when they change
      state.filteredMovies = applyFiltersToMovies(state.movies, state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        yearRange: [1900, new Date().getFullYear()],
        minRating: 0,
        genre: 'all',
        language: 'all', // <-- Add this
      };
      state.filteredMovies = state.movies;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        // Apply current filters to new search results
        state.filteredMovies = applyFiltersToMovies(action.payload.movies, state.filters);
        state.totalResults = action.payload.totalResults;
        state.currentPage = action.payload.page;
        state.error = null;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearSearch, setCurrentPage, setFilters, clearFilters } = movieSlice.actions;
export default movieSlice.reducer;
