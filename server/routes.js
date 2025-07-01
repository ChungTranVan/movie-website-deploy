const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Lấy pool kết nối từ app.locals
function getDb(req) {
  return req.app.locals.db;
}

// Đăng ký
router.post('/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = getDb(req);
    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hash, email]);
    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = getDb(req);
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    res.json({ id: user.id, username: user.username, email: user.email, is_admin: user.is_admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy danh sách phim
router.get('/movies', async (req, res) => {
  try {
    const db = getDb(req);
    const [rows] = await db.execute('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm phim (admin)
router.post('/movies', async (req, res) => {
  const { title, description, poster_url, release_date, genre } = req.body;
  try {
    const db = getDb(req);
    await db.execute('INSERT INTO movies (title, description, poster_url, release_date, genre) VALUES (?, ?, ?, ?, ?)', [title, description, poster_url, release_date, genre]);
    res.json({ message: 'Movie added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa phim (admin)
router.put('/movies/:id', async (req, res) => {
  const { title, description, poster_url, release_date, genre, is_admin } = req.body;
  if (!is_admin) return res.status(403).json({ message: 'Admin only' });
  try {
    const db = getDb(req);
    await db.execute(
      'UPDATE movies SET title=?, description=?, poster_url=?, release_date=?, genre=? WHERE id=?',
      [title, description, poster_url, release_date, genre, req.params.id]
    );
    res.json({ message: 'Movie updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa phim (admin)
router.delete('/movies/:id', async (req, res) => {
  const { is_admin } = req.body;
  if (!is_admin) return res.status(403).json({ message: 'Admin only' });
  try {
    const db = getDb(req);
    await db.execute('DELETE FROM movies WHERE id=?', [req.params.id]);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đặt vé
router.post('/bookings', async (req, res) => {
  const { user_id, movie_id } = req.body;
  try {
    const db = getDb(req);
    await db.execute('INSERT INTO bookings (user_id, movie_id) VALUES (?, ?)', [user_id, movie_id]);
    res.json({ message: 'Booking successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy vé của user
router.get('/bookings/:user_id', async (req, res) => {
  try {
    const db = getDb(req);
    const [rows] = await db.execute('SELECT b.*, m.title FROM bookings b JOIN movies m ON b.movie_id = m.id WHERE b.user_id = ?', [req.params.user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Quên mật khẩu (giả lập)
router.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  // Có thể kiểm tra email trong DB, gửi mail thực tế nếu muốn
  res.json({ message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi!' });
});

module.exports = router; 