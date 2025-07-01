-- Tạo database
CREATE DATABASE IF NOT EXISTS movie_website;
USE movie_website;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng phim
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poster_url VARCHAR(255),
  release_date DATE,
  genre VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng đặt vé
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  movie_id INT,
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Seed dữ liệu mẫu
INSERT INTO users (username, password, email, is_admin) VALUES
('admin', '$2b$10$hash', 'admin@email.com', TRUE),
('user1', '$2b$10$hash', 'user1@email.com', FALSE);

INSERT INTO movies (title, description, poster_url, release_date, genre) VALUES
('Inception', 'A mind-bending thriller', 'https://image.tmdb.org/t/p/inception.jpg', '2010-07-16', 'Sci-Fi'),
('Avengers: Endgame', 'Superhero epic', 'https://image.tmdb.org/t/p/avengers.jpg', '2019-04-26', 'Action'); 