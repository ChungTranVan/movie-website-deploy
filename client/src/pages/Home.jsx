import { Box } from '@mui/material';
import MovieSlider from '../components/MovieSlider';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [newMovies, setNewMovies] = useState([]);
  const [topSeries, setTopSeries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies').then(res => {
      setNewMovies(res.data.slice(0, 8));
      setTopSeries(res.data.slice(0, 10)); // demo, thực tế nên có API riêng
    });
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: { xs: 1, md: 3 }, mt: 4 }}>
      <MovieSlider movies={newMovies} title="Phim Lẻ" />
      <MovieSlider movies={topSeries} title="Phim Bộ" />
    </Box>
  );
} 