import Slider from 'react-slick';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function MovieSlider({ movies, title }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#fff', fontWeight: 700 }}>{title}</Typography>
      <Slider {...settings}>
        {movies.map((movie) => (
          <Box key={movie.id} sx={{ px: 1 }}>
            <Card sx={{ bgcolor: '#23242a', color: '#fff', borderRadius: 2 }}>
              <CardMedia component="img" height="250" image={movie.poster_url} alt={movie.title} />
              <CardContent>
                <Typography variant="subtitle1" noWrap>{movie.title}</Typography>
                <Typography variant="caption" color="#aaa">{movie.genre}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
} 