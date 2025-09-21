require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

// CORS configuration cho production
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'https://your-vercel-app.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Movie Website API is running!' });
});

// ==== AUTH ROUTES ====

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hash, email]);
    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }
    
    res.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      is_admin: user.is_admin 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== MOVIES ROUTES ====

// Lấy danh sách phim kèm genres và countries
app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM movies ORDER BY created_at DESC');

    // Lấy genres và countries cho tất cả movies
    const movieIds = rows.map(row => row.id);
    let genresMap = {};
    let countriesMap = {};

    if (movieIds.length > 0) {
      const placeholders = movieIds.map(() => '?').join(',');
      
      // Lấy genres
      const [genreRows] = await db.execute(`
        SELECT mg.movie_id, g.name 
        FROM movie_genres mg 
        JOIN genres g ON mg.genre_id = g.id 
        WHERE mg.movie_id IN (${placeholders})
      `, movieIds);
      
      genreRows.forEach(row => {
        if (!genresMap[row.movie_id]) genresMap[row.movie_id] = [];
        genresMap[row.movie_id].push(row.name);
      });

      // Lấy countries
      const [countryRows] = await db.execute(`
        SELECT mc.movie_id, c.name 
        FROM movie_countries mc 
        JOIN countries c ON mc.country_id = c.id 
        WHERE mc.movie_id IN (${placeholders})
      `, movieIds);
      
      countryRows.forEach(row => {
        if (!countriesMap[row.movie_id]) countriesMap[row.movie_id] = [];
        countriesMap[row.movie_id].push(row.name);
      });
    }

    // Gắn genres và countries vào movies
    const moviesWithDetails = rows.map(movie => ({
      ...movie,
      age_limit: movie.age_limit,
      original_title: movie.original_title,
      release_year: movie.release_year,
      is_series: movie.is_series,
      imdb_rating: movie.imdb_rating,
      quality: movie.quality,
      genres: genresMap[movie.id] || [],
      countries: countriesMap[movie.id] || []
    }));

    res.json(moviesWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết phim theo ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = rows[0];
    
    // Lấy genres
    const [genreRows] = await db.execute(`
      SELECT g.name 
      FROM movie_genres mg 
      JOIN genres g ON mg.genre_id = g.id 
      WHERE mg.movie_id = ?
    `, [movie.id]);
    
    // Lấy countries
    const [countryRows] = await db.execute(`
      SELECT c.name 
      FROM movie_countries mc 
      JOIN countries c ON mc.country_id = c.id 
      WHERE mc.movie_id = ?
    `, [movie.id]);

    const movieWithDetails = {
      ...movie,
      genres: genreRows.map(row => row.name),
      countries: countryRows.map(row => row.name)
    };

    res.json(movieWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm phim (admin)
app.post('/api/movies', async (req, res) => {
  const { title, description, poster_url, age_limit, original_title, release_year, duration, is_series, trailer_url, imdb_rating, quality } = req.body;
  
  try {
    await db.execute(
      'INSERT INTO movies (title, description, poster_url, age_limit, original_title, release_year, duration, is_series, trailer_url, imdb_rating, quality) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, poster_url, age_limit, original_title, release_year, duration, is_series, trailer_url, imdb_rating, quality]
    );
    res.json({ message: 'Movie added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa phim (admin)
app.put('/api/movies/:id', async (req, res) => {
  const { title, description, poster_url, age_limit, original_title, release_year, duration, is_series, trailer_url, imdb_rating, quality, is_admin } = req.body;
  
  if (!is_admin) {
    return res.status(403).json({ message: 'Admin only' });
  }
  
  try {
    await db.execute(
      'UPDATE movies SET title=?, description=?, poster_url=?, age_limit=?, original_title=?, release_year=?, duration=?, is_series=?, trailer_url=?, imdb_rating=?, quality=? WHERE id=?',
      [title, description, poster_url, age_limit, original_title, release_year, duration, is_series, trailer_url, imdb_rating, quality, req.params.id]
    );
    res.json({ message: 'Movie updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa phim (admin)
app.delete('/api/movies/:id', async (req, res) => {
  const is_admin = req.query.is_admin === 'true';
  
  if (!is_admin) {
    return res.status(403).json({ message: 'Admin only' });
  }
  
  try {
    await db.execute('DELETE FROM movies WHERE id=?', [req.params.id]);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== COUNTRIES ROUTES ====

// Lấy danh sách quốc gia
app.get('/api/countries', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM countries ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm quốc gia mới
app.post('/api/countries', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Missing name' });
  }
  
  try {
    // Kiểm tra trùng tên
    const [rows] = await db.execute('SELECT id FROM countries WHERE name = ?', [name]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Tên quốc gia đã tồn tại' });
    }
    
    await db.execute('INSERT INTO countries (name) VALUES (?)', [name]);
    res.json({ message: 'Thêm quốc gia thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== GENRES ROUTES ====

// Lấy danh sách thể loại
app.get('/api/genres', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM genres ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm thể loại mới
app.post('/api/genres', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Missing name' });
  }
  
  try {
    // Kiểm tra trùng tên
    const [rows] = await db.execute('SELECT id FROM genres WHERE name = ?', [name]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Tên thể loại đã tồn tại' });
    }
    
    await db.execute('INSERT INTO genres (name) VALUES (?)', [name]);
    res.json({ message: 'Thêm thể loại thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== BOOKINGS ROUTES ====

// Đặt vé
app.post('/api/bookings', async (req, res) => {
  const { user_id, movie_id } = req.body;
  
  try {
    await db.execute('INSERT INTO bookings (user_id, movie_id) VALUES (?, ?)', [user_id, movie_id]);
    res.json({ message: 'Booking successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy vé của user
app.get('/api/bookings/:user_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT b.*, m.title FROM bookings b JOIN movies m ON b.movie_id = m.id WHERE b.user_id = ?', 
      [req.params.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export cho Vercel
module.exports = app;