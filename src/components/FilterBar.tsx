import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import type { RootState, AppDispatch } from '../redux/store';
import { setFilters, clearFilters } from '../redux/movieSlice';

interface FilterState {
  yearRange: [number, number];
  minRating: number;
  genre: string;
  language: string; // <-- Add this
}

interface FilterBarProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ isOpen, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters: reduxFilters } = useSelector((state: RootState) => state.movies);
  
  const [localFilters, setLocalFilters] = useState<FilterState>({
    yearRange: [1900, new Date().getFullYear()],
    minRating: 0,
    genre: 'all',
    language: 'all', // <-- Add this
  });

  // Use external state if provided, otherwise use internal state
  const showFilters = isOpen !== undefined ? isOpen : false;
  const setShowFilters = onToggle || (() => {});

  // Sync local filters with Redux filters when they change
  useEffect(() => {
    setLocalFilters(reduxFilters as FilterState);
  }, [reduxFilters]);

  // Available genres (you can expand this list)
  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'animation', label: 'Animation' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'crime', label: 'Crime' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'drama', label: 'Drama' },
    { value: 'family', label: 'Family' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'war', label: 'War' },
    { value: 'western', label: 'Western' },
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    // ...add more as needed
  ];

  const handleYearChange = (_event: Event, newValue: number | number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      yearRange: newValue as [number, number]
    }));
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: newValue as number
    }));
  };

  const handleGenreChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters(prev => ({
      ...prev,
      genre: event.target.value
    }));
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLocalFilters(prev => ({
      ...prev,
      language: event.target.value
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      yearRange: [1900, new Date().getFullYear()] as [number, number],
      minRating: 0,
      genre: 'all',
      language: 'all', // <-- Add this
    };
    setLocalFilters(defaultFilters);
    dispatch(clearFilters());
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = localFilters.genre !== 'all' || 
                         localFilters.minRating > 0 || 
                         localFilters.yearRange[0] > 1900 || 
                         localFilters.yearRange[1] < new Date().getFullYear() ||
                         localFilters.language !== 'all'; // <-- Add this

  // Hide filter bar unless explicitly opened via filter icon
  if (!showFilters) {
    return null;
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 3, 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={handleToggleFilters}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" color="text.primary">
            Filters
          </Typography>
          {hasActiveFilters && (
            <Chip 
              label="Active" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {showFilters ? 'Hide' : 'Show'} filters
        </Typography>
      </Box>

      {showFilters && (
        <>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Year Range Filter */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Release Year Range
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={localFilters.yearRange}
                    onChange={handleYearChange}
                    valueLabelDisplay="auto"
                    min={1900}
                    max={new Date().getFullYear()}
                    sx={{ mt: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {localFilters.yearRange[0]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {localFilters.yearRange[1]}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Rating Filter */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Minimum Rating
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={localFilters.minRating}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    step={0.5}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 5, label: '5' },
                      { value: 10, label: '10' }
                    ]}
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                    {localFilters.minRating}+ stars
                  </Typography>
                </Box>
              </Box>

              {/* Genre Filter */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Genre
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Genre</InputLabel>
                  <Select
                    value={localFilters.genre}
                    label="Select Genre"
                    onChange={handleGenreChange}
                  >
                    {genres.map((genre) => (
                      <MenuItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Language Filter */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Language
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Language</InputLabel>
                  <Select
                    value={localFilters.language}
                    label="Select Language"
                    onChange={handleLanguageChange}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ borderRadius: 2 }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default FilterBar;
