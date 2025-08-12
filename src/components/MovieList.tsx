import React from 'react';
import { useSelector } from 'react-redux';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import type { RootState } from '../redux/store';
import MovieCard from './MovieCard';

const MovieList: React.FC = () => {
  const { movies, loading, error, totalResults, searchQuery } = useSelector(
    (state: RootState) => state.movies
  );

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8,
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Searching for movies...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 3,
          '& .MuiAlert-message': {
            fontSize: '1.1rem'
          }
        }}
      >
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Search Error
        </Typography>
        {error}
      </Alert>
    );
  }

  if (!searchQuery) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 2, color: '#2c3e50' }}>
          🎬 Welcome to Movie Search!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Enter a movie title above to start discovering amazing films.
        </Typography>
      </Paper>
    );
  }

  if (movies.length === 0) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
          borderRadius: 3
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#2d3436' }}>
          🔍 No movies found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Try searching for a different movie title or check your spelling.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Searched for: "{searchQuery}"
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 1, color: '#2c3e50' }}>
          Search Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found {totalResults} movie{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3
      }}>
        {movies.map((movie) => (
          <Box key={movie.id}>
            <MovieCard movie={movie} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MovieList;
