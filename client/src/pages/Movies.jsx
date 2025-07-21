import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination, Stack, Button, TextField, Divider } 
from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './Movies.css';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import FilterBox from '../components/Filter/FilterBox';

const PAGE_SIZE = 16;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [country, setCountry] = useState(["Tất cả"]);
  const [type, setType] = useState("Tất cả");
  const [rating, setRating] = useState(["Tất cả"]);
  const [genre, setGenre] = useState(["Tất cả"]);
  const [version, setVersion] = useState("Tất cả");
  const [year, setYear] = useState(["Tất cả"]);
  const [inputYear, setInputYear] = useState("");
  const [sort, setSort] = useState("Mới nhất");
  const location = useLocation();

  // Đảm bảo mọi lần setGenre đều là mảng
  const safeSetGenre = (val) => {
    if (Array.isArray(val)) setGenre(val);
    else if (typeof val === 'string') setGenre([val]);
    else setGenre(['Tất cả']);
  };

  // Lấy query param is_series
  function getIsSeries() {
    const params = new URLSearchParams(location.search);
    return params.get('is_series');
  }
  const isSeriesParam = getIsSeries();
  const isSeries = isSeriesParam === '1' ? true : isSeriesParam === '0' ? false : null;

  // Lấy query param genre
  function getGenre() {
    const params = new URLSearchParams(location.search);
    return params.get('genre');
  }
  const genreParam = getGenre();

  // Lấy query param country
  function getCountry() {
    const params = new URLSearchParams(location.search);
    return params.get('country');
  }
  const countryParam = getCountry();

  // Lấy query param tab
  function getTab() {
    const params = new URLSearchParams(location.search);
    return params.get('tab');
  }
  const tabParam = getTab();
  const isActorTab = tabParam === 'actor';

  const [actors, setActors] = useState([]);
  useEffect(() => {
    if (isActorTab) {
      fetch('http://localhost:5000/api/actors')
        .then(res => res.json())
        .then(data => setActors(data));
    } else {
      fetch('http://localhost:5000/api/movies')
        .then(res => res.json())
        .then(data => {
          let filtered = data;
          if (isSeries !== null) {
            filtered = filtered.filter(m => !!m.is_series === isSeries);
          }
          if (genreParam) {
            filtered = filtered.filter(m =>
              (Array.isArray(m.genres) ? m.genres : (m.genres ? JSON.parse(m.genres) : [])).some(g =>
                (g.name || g).toLowerCase() === genreParam.toLowerCase()
              )
            );
          }
          if (countryParam) {
            filtered = filtered.filter(m =>
              (Array.isArray(m.countries) ? m.countries : (m.countries ? JSON.parse(m.countries) : [])).some(c =>
                (c.name || c).toLowerCase() === countryParam.toLowerCase()
              )
            );
          }
          setMovies(filtered);
        });
    }
  }, [isSeries, genreParam, countryParam, isActorTab]);

  // Hàm filter phim
  const handleFilter = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'genre') {
        if (Array.isArray(value) && value.length > 0 && !(value.length === 1 && value[0] === 'Tất cả')) {
          value.forEach(g => params.append('genre', g));
        }
      } else {
        if (value && value !== 'Tất cả') params.append(key, value);
      }
    });
    fetch(`http://localhost:5000/api/movies/filter?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
        setPage(1);
      });
  };

  const pagedMovies = movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Đặt page title
  let pageTitle = 'Danh Sách Phim';
  if (isActorTab) pageTitle = 'Diễn viên';
  else if (isSeries === true) pageTitle = 'Phim Bộ';
  else if (isSeries === false) pageTitle = 'Phim Lẻ';
  if (genreParam) pageTitle = `Phim ${genreParam}`;
  if (countryParam) pageTitle = `Phim ${countryParam}`;

  return (
    <Box className="movies-outer-container">
      <Box className="movies-content">
        {/* <Header /> đã bị xóa vì đã render ở App.jsx */}
        <Box className="movies-container">
          {/* Bộ lọc header và box sát trái */}
          <div className="movies-filter-wrapper">
            <Typography variant="h4" className="movies-page-title" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
              {pageTitle}
            </Typography>
            {!isActorTab && (
              <>
                <Box className="movies-filter-header" onClick={() => setShowFilter(v => !v)}>
                  <FilterListIcon 
                    className="movies-filter-icon"
                    sx={{ color: showFilter ? '#FFD600' : '#fff', transition: 'color 0.2s' }}
                  />
                  <Typography variant="h6" className="movies-filter-title">
                    Bộ lọc
                  </Typography>
                </Box>
                {showFilter && (
                  <FilterBox
                    country={country}
                    setCountry={setCountry}
                    type={type}
                    setType={setType}
                    rating={rating}
                    setRating={setRating}
                    genre={genre}
                    setGenre={setGenre}
                    year={year}
                    setYear={setYear}
                    inputYear={inputYear}
                    setInputYear={setInputYear}
                    sort={sort}
                    setSort={setSort}
                    onClose={() => setShowFilter(false)}
                    onFilter={handleFilter}
                  />
                )}
              </>
            )}
          </div>
          {/* Danh sách phim */}
          {isActorTab ? (
            actors.length > 0 ? (
              <Grid container spacing={3} className="movies-list">
                {actors.map((actor, idx) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={1}
                    key={`actor-${actor.id || idx}`}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <div className="movies-card-imgbox">
                      <img
                        src={actor.profile_pic_url}
                        alt={actor.name}
                        className="movies-card-img"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="movies-card-content">
                      <div className="movies-card-title" style={{ textAlign: 'center' }}>{actor.name}</div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography className="movies-empty">
                Không có diễn viên nào để hiển thị.
              </Typography>
            )
          ) : (
            pagedMovies.length > 0 ? (
              <Grid container spacing={3} className="movies-list">
                {pagedMovies.map((movie, idx) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={1}
                    key={movie.id ? `movie-${movie.id}` : `idx-${idx}`}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Link to={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                      <div className="movies-card-imgbox">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="movies-card-img"
                        />
                        {movie.badge && (
                          <span className={`movies-badge movies-badge-${movie.badge}`}>{movie.badge}</span>
                        )}
                      </div>
                    </Link>
                    <div className="movies-card-content">
                      <div className="movies-card-title">{movie.title}</div>
                      {movie.original_title && movie.original_title !== movie.title && (
                        <div className="movies-card-original">{movie.original_title}</div>
                      )}
                    </div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography className="movies-empty">
                Không có phim nào để hiển thị.
              </Typography>
            )
          )}
          <Stack alignItems="center" className="movies-pagination">
            <Pagination
              count={Math.ceil(movies.length / PAGE_SIZE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
} 