-- Kiểm tra và tạo bảng category_countries nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS `category_countries` (
  `category_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  PRIMARY KEY (`category_id`, `country_id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Kiểm tra xem bảng đã được tạo chưa
SHOW TABLES LIKE 'category_countries';

-- Kiểm tra cấu trúc bảng
DESCRIBE category_countries; 