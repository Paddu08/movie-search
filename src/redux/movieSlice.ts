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
}

export interface MovieSearchState {
  movies: Movie[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
}

const initialState: MovieSearchState = {
  movies: [],
  searchQuery: '',
  loading: false,
  error: null,
  totalResults: 0,
  currentPage: 1,
};

// Async thunk for searching movies
export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      // You'll need to add your TMDB API key to an environment variable
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
      
      const fullUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
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

export const { setSearchQuery, clearSearch, setCurrentPage } = movieSlice.actions;
export default movieSlice.reducer;
