import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import type { AppDispatch, RootState } from '../redux/store';
import { searchMovies, setSearchQuery, clearSearch } from '../redux/movieSlice';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery, loading } = useSelector((state: RootState) => state.movies);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    if (localQuery.trim()) {
      dispatch(setSearchQuery(localQuery.trim()));
      dispatch(searchMovies({ query: localQuery.trim() }));
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(clearSearch());
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 3, 
          textAlign: 'center', 
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        🎬 Movie Search
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for movies..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: localQuery && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClear}
                  size="small"
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!localQuery.trim() || loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: 'white',
            color: '#667eea',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255,255,255,0.5)',
              color: 'rgba(102,126,234,0.5)',
            }
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>
      
      {searchQuery && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.8)',
            fontStyle: 'italic'
          }}
        >
          Searching for: "{searchQuery}"
        </Typography>
      )}
    </Paper>
  );
};

export default SearchBar;
