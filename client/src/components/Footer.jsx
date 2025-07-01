import { Box, Typography, Link, Stack, IconButton, Divider, Grid } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box sx={{ width: '100vw', bgcolor: '#181A20', color: '#fff', pt: 4, pb: 2 }} component="footer">
      <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <PlayCircleIcon sx={{ fontSize: 40, color: '#FFD600' }} />
              <Box component={RouterLink} to="/" sx={{ cursor: 'pointer', color: '#fff', textDecoration: 'none', transition: 'none', '&:hover': { color: '#fff', textDecoration: 'none', background: 'none' } }}>
                <Typography variant="h5" fontWeight={700}>Phim Lmao</Typography>
                <Typography variant="body2" color="#aaa">Phim cười cả ngày</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} mb={2}>
              <IconButton color="inherit"><TelegramIcon /></IconButton>
              <IconButton color="inherit"><FacebookIcon /></IconButton>
              <IconButton color="inherit"><TwitterIcon /></IconButton>
              <IconButton color="inherit"><YouTubeIcon /></IconButton>
              <IconButton color="inherit"><CameraAltIcon /></IconButton>
              <IconButton color="inherit"><InstagramIcon /></IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12} md={9}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={1} flexWrap="wrap">
              <Link href="#" color="inherit" underline="hover">Hỏi-Đáp</Link>
              <Link href="#" color="inherit" underline="hover">Chính sách bảo mật</Link>
              <Link href="#" color="inherit" underline="hover">Điều khoản sử dụng</Link>
              <Link href="#" color="inherit" underline="hover">Giới thiệu</Link>
              <Link href="#" color="inherit" underline="hover">Liên hệ</Link>
            </Stack>
            <Typography variant="body2" color="#aaa" mb={1}>
              RoPhim – Phim hay cả rổ - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại. Khám phá nền tảng phim trực tuyến hay nhất 2024 chất lượng 4K!
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2, borderColor: '#333' }} />
        <Typography variant="body2" color="#aaa" align="center">
          © {new Date().getFullYear()} RoPhim
        </Typography>
      </Box>
    </Box>
  );
}