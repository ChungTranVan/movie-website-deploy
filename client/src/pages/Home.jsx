import { Box } from '@mui/material';
import MovieSlider from '../components/MovieSlider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Banner from '../components/Banner';

export default function Home() {
  const [newMovies, setNewMovies] = useState([]);
  const [topSeries, setTopSeries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies').then(res => {
      // Map lại dữ liệu để MovieSlider nhận đúng trường poster
      const movies = res.data.slice(0, 16).map(movie => ({
        ...movie,
        poster: movie.poster_url, // map đúng trường cho MovieSlider
        originalTitle: movie.original_title || movie.title,
      }));
      setNewMovies(movies);
      setTopSeries(res.data.slice(0, 10));
    });
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 2000, mx: 'auto', px: { xs: 6, md: 9 } }}>
      <Banner />
      <Box sx={{ width: '100%', mt: 7, mb: 6 }}>
        <Box sx={{ width: '100%', maxWidth: 2000, mx: 'auto' }}>
          <MovieSlider movies={newMovies} title="Tất cả phim" />
        </Box>
      </Box>
    </Box>
  );
} 