# Hướng dẫn Deploy Movie Website lên Render

## Backend đã được deploy tại: https://backend-w-pxql.onrender.com

## Deploy Frontend lên Render

### Bước 1: Chuẩn bị
1. Đảm bảo tất cả code đã được commit lên Git repository
2. Backend đã được deploy thành công trên Render

### Bước 2: Tạo Static Site trên Render
1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Kết nối với Git repository của bạn

### Bước 3: Cấu hình Build
- **Name**: `movie-website-frontend` (hoặc tên bạn muốn)
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`
- **Environment Variables**: Không cần thiết vì đã cấu hình trong code

### Bước 4: Deploy
1. Click "Create Static Site"
2. Render sẽ tự động build và deploy
3. URL sẽ có dạng: `https://your-app-name.onrender.com`

## Cấu hình đã được thực hiện

### 1. Environment Variables
- Tạo file `client/env.production` với `VITE_API_URL=https://backend-w-pxql.onrender.com`
- Tất cả API calls đã được cập nhật để sử dụng environment variable

### 2. Vite Configuration
- Cập nhật `vite.config.js` để hỗ trợ production build
- Thêm script `start` trong `package.json`

### 3. SPA Routing
- Tạo file `client/public/_redirects` để hỗ trợ React Router
- Cấu hình trong `render.yaml` để handle SPA routing

### 4. API Endpoints
Tất cả API calls đã được cập nhật từ:
```javascript
// Trước
axios.post('http://localhost:5000/api/auth/login', data)

// Sau
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.post(`${API}/api/auth/login`, data)
```

## Kiểm tra sau khi deploy

1. **Frontend**: Truy cập URL được cung cấp bởi Render
2. **API Connection**: Kiểm tra console để đảm bảo không có lỗi CORS
3. **Authentication**: Test đăng nhập/đăng ký
4. **Movie Loading**: Kiểm tra việc load phim từ backend

## Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS, kiểm tra backend đã cấu hình đúng:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.onrender.com'],
  credentials: true
}));
```

### Lỗi Build
- Kiểm tra `package.json` có đầy đủ dependencies
- Đảm bảo Node.js version tương thích (>= 16)

### Lỗi API
- Kiểm tra backend URL có đúng không
- Đảm bảo backend đang hoạt động

## Cấu trúc file đã thay đổi

```
├── client/
│   ├── env.production          # Environment variables cho production
│   ├── public/_redirects       # SPA routing cho Netlify
│   ├── package.json            # Thêm script start
│   └── vite.config.js          # Cấu hình production
├── render.yaml                 # Cấu hình Render
└── DEPLOYMENT.md              # File này
```

## Lưu ý quan trọng

1. **Environment Variables**: Đảm bảo `VITE_API_URL` trỏ đến backend đúng
2. **Database**: Backend cần có database được cấu hình đúng
3. **CORS**: Backend phải cho phép frontend domain
4. **SSL**: Render tự động cung cấp HTTPS
