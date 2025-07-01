import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import MovieList from '../components/MovieList';

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies').then(res => setMovies(res.data));
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: { xs: 1, md: 3 }, mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 700, pl: 2 }}>Danh sách phim</Typography>
      <MovieList movies={movies} />
    </Box>
  );
} 