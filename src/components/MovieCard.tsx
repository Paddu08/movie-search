import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import type { Movie } from '../redux/movieSlice';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const getPosterUrl = (posterPath: string) => {
    if (!posterPath) return '/placeholder-poster.jpg';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        cursor: 'pointer',
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={getPosterUrl(movie.poster_path)}
        alt={movie.title}
        sx={{
          objectFit: 'cover',
          backgroundColor: '#f5f5f5',
        }}
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-poster.jpg';
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            mb: 1,
            fontWeight: 'bold',
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {movie.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={movie.vote_average / 2} 
            precision={0.5} 
            size="small"
            readOnly
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {movie.vote_average.toFixed(1)}/10
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label={formatDate(movie.release_date)} 
            size="small" 
            variant="outlined"
            color="primary"
          />
          {movie.vote_average >= 7 && (
            <Chip 
              label="⭐ Top Rated" 
              size="small" 
              color="success"
              variant="filled"
            />
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {movie.overview || 'No overview available.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
