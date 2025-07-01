import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Menu, MenuItem, Avatar, Button, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import MovieIcon from '@mui/icons-material/Movie';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useState, useRef } from 'react';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import Fade from '@mui/material/Fade';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';

const menuItems = [
  { label: 'Thể loại', children: ['Hành động', 'Tình cảm', 'Kinh dị', 'Hoạt hình', 'Phiêu lưu', 'Hài', 'Tâm lý', 'Viễn tưởng'] },
  { label: 'Phim Lẻ' },
  { label: 'Phim Bộ' },
  { label: 'Lịch chiếu' },
  { label: 'Quốc gia', children: ['Việt Nam', 'Hàn Quốc', 'Trung Quốc', 'Mỹ', 'Nhật Bản', 'Thái Lan'] },
  { label: 'Diễn viên', children: ['Lee Min Ho', 'Triệu Lệ Dĩnh', 'Tom Cruise', 'Dương Tử', 'Song Hye Kyo'] },
];

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenu, setSubmenu] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const submenuCloseTimeout = useRef();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notificationTab, setNotificationTab] = useState(0);
  const [genreMenuAnchor, setGenreMenuAnchor] = useState(null);
  const [countryMenuAnchor, setCountryMenuAnchor] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleUserMenu = (event) => setUserMenu(event.currentTarget);
  const handleUserClose = () => setUserMenu(null);
  const handleSubmenu = (event, children) => {
    clearTimeout(submenuCloseTimeout.current);
    setSubmenu({ anchor: event.currentTarget, items: children });
  };
  const handleSubmenuClose = () => {
    submenuCloseTimeout.current = setTimeout(() => setSubmenu(null), 120); // delay 120ms
  };
  const handleSubmenuListEnter = () => {
    clearTimeout(submenuCloseTimeout.current);
  };
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  const handleNotificationTab = (event, newValue) => {
    setNotificationTab(newValue);
  };
  const handleGenreMenuClick = (event) => {
    setGenreMenuAnchor(event.currentTarget);
  };
  const handleGenreMenuClose = () => {
    setGenreMenuAnchor(null);
  };
  const handleCountryMenuClick = (event) => {
    setCountryMenuAnchor(event.currentTarget);
  };
  const handleCountryMenuClose = () => {
    setCountryMenuAnchor(null);
  };

  return (
    <AppBar position="fixed" color="default" sx={{ bgcolor: '#181A20', color: '#fff' }}>
      <Box sx={{ width: '100%', maxWidth: '1600px', mx: 'auto', px: 2 }}>
        <Toolbar disableGutters>
          <MovieIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 0, fontWeight: 700, mr: 2, cursor: 'pointer', color: '#fff', textDecoration: 'none', transition: 'none', '&:hover': { color: '#fff', textDecoration: 'none', background: 'none' } }}
            component={RouterLink}
            to="/"
          >
            Phim Lmao
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: '#23242a', borderRadius: 2, px: 2, py: 0.5, display: 'flex', alignItems: 'center', width: { xs: 180, sm: 250, md: 350 } }}>
              <SearchIcon sx={{ mr: 1, color: '#aaa' }} />
              <InputBase placeholder="Tìm kiếm phim, diễn viên" sx={{ color: '#fff', width: '100%' }} />
            </Box>
          </Box>
          {/* Menu desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {menuItems.map((item) => (
              item.label === 'Thể loại' ? (
                <Box key={item.label}>
                  <Button
                    sx={{
                      color: '#fff',
                      mx: 1,
                      transition: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                      background: 'none',
                      '&:hover': { bgcolor: 'transparent', color: '#fff' },
                      '&:active': { boxShadow: 'none', outline: 'none', background: 'none' },
                      '&:focus': { boxShadow: 'none', outline: 'none', background: 'none' },
                    }}
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleGenreMenuClick}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={genreMenuAnchor}
                    open={Boolean(genreMenuAnchor)}
                    onClose={handleGenreMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        bgcolor: '#232a3b',
                        color: '#fff',
                        minWidth: 320,
                        maxWidth: 370,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: 6,
                        p: 1.5,
                        overflow: 'visible',
                      }
                    }}
                  >
                    <Grid container spacing={0} columns={3} sx={{ minWidth: 320 }}>
                      {[
                        'Anime', 'Chuyển Thể', 'Chương Trình Truyền Hình', 'Cổ Trang', 'Disney', 'Giả Tưởng', 'Hành Động',
                        'Kinh Dị', 'Miền Viễn Tây', 'Phép Thuật', 'Thể Thao', 'Võ Thuật', 'Bí Ẩn', 'Chính Kịch',
                        'Cung Đấu', 'Cổ Tích', 'Gay Cấn', 'Hoàng Cung', 'Hình Sự', 'Kinh Điển', 'Lãng Mạn',
                        'Nghệ Nghiệp', 'Siêu Anh Hùng', 'Truyền Hình Thực Tế', 'Tình Cảm', 'Xuyên Không', 'Chiến Tranh', 'Chiến Luận',
                        'Cuối Tuần', 'Gia Đình', 'Hoạt Hình', 'Học Đường', 'Kịch Nói', 'Lịch Sử', 'Nhạc Kịch',
                        'Thiếu Nhi', 'Tuổi Trẻ', 'Tập Luyện', 'Đau Thương', 'Chiếu Rạp', 'Chính Trị', 'Cách Mạng',
                        'DC', 'Giáng Sinh', 'Hài', 'Khoa Học', 'Kỳ Ảo', 'Marvel', 'Phiêu Lưu', 'Thần Thoại', 'Tài Liệu', 'Viễn Tưởng', 'Đời Thường'
                      ].map((genre, idx, arr) => (
                        <Grid item xs={1} key={genre} sx={{ py: 0.2, px: 0.5, width: 1/3 }}>
                          <Box sx={{
                            cursor: 'pointer',
                            color: '#fff',
                            fontSize: 13.5,
                            lineHeight: 1.7,
                            maxWidth: 110,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'none',
                            '&:hover': {
                              color: '#fff',
                              bgcolor: 'inherit',
                              px: 0.5,
                            }
                          }} onClick={handleGenreMenuClose}>
                            {genre}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Menu>
                </Box>
              ) : item.label === 'Quốc gia' ? (
                <Box key={item.label}>
                  <Button
                    sx={{ color: '#fff', mx: 1, transition: 'none', '&:hover': { bgcolor: 'transparent', color: '#fff' }, boxShadow: 'none', outline: 'none', background: 'none', '&:active': { boxShadow: 'none', outline: 'none', background: 'none' }, '&:focus': { boxShadow: 'none', outline: 'none', background: 'none' } }}
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleCountryMenuClick}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={countryMenuAnchor}
                    open={Boolean(countryMenuAnchor)}
                    onClose={handleCountryMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        bgcolor: '#232a3b',
                        color: '#fff',
                        minWidth: 160,
                        maxWidth: 200,
                        borderRadius: 2,
                        mt: 1.5,
                        boxShadow: 6,
                        p: 0.5,
                        overflow: 'visible',
                      }
                    }}
                  >
                    {['Anh', 'Canada', 'Hàn Quốc', 'Hồng Kông', 'Mỹ', 'Nhật Bản', 'Pháp', 'Thái Lan', 'Trung Quốc', 'Úc', 'Đài Loan', 'Đức'].map((country) => (
                      <Box key={country} sx={{ color: '#fff', fontSize: 15, px: 2, py: 0.7, borderRadius: 1, cursor: 'pointer', transition: 'none', bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent', color: '#FFA726' }, '&.Mui-selected': { color: '#FFA726' } }} onClick={handleCountryMenuClose}>
                        {country}
                      </Box>
                    ))}
                  </Menu>
                </Box>
              ) : item.label === 'Diễn viên' ? (
                <Button
                  key={item.label}
                  sx={{
                    color: '#fff',
                    mx: 1,
                    transition: 'none',
                    boxShadow: 'none',
                    outline: 'none',
                    background: 'none',
                    '&:hover': { bgcolor: 'transparent', color: '#FFA726' },
                    '&:active': { boxShadow: 'none', outline: 'none', background: 'none' },
                    '&:focus': { boxShadow: 'none', outline: 'none', background: 'none' },
                  }}
                >
                  {item.label}
                </Button>
              ) : item.children ? (
                <Box key={item.label} onMouseLeave={handleSubmenuClose}>
                  <Button
                    sx={{
                      color: '#fff',
                      mx: 1,
                      transition: 'none',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: (item.label === 'Phim Lẻ' || item.label === 'Phim Bộ' || item.label === 'Lịch chiếu' || item.label === 'Xem Chung' || item.label === 'Diễn viên') ? '#FFA726' : '#fff',
                      },
                      fontWeight: item.label === 'Phim Lẻ' || item.label === 'Phim Bộ' || item.label === 'Xem Chung' ? 700 : 400,
                    }}
                    endIcon={<ExpandMoreIcon />}
                    onMouseEnter={e => handleSubmenu(e, item.children)}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={submenu?.anchor}
                    open={submenu && submenu.items === item.children}
                    onClose={() => setSubmenu(null)}
                    MenuListProps={{ onMouseEnter: handleSubmenuListEnter, onMouseLeave: handleSubmenuClose }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    TransitionComponent={Fade}
                    transitionDuration={220}
                    disableScrollLock
                  >
                    {item.children.map((child) => (
                      <MenuItem key={child} onClick={() => setSubmenu(null)}>{child}</MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={item.label}
                  sx={{
                    color: '#fff',
                    mx: 1,
                    transition: 'none',
                    boxShadow: 'none',
                    outline: 'none',
                    background: 'none',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: (item.label === 'Phim Lẻ' || item.label === 'Phim Bộ' || item.label === 'Lịch chiếu' || item.label === 'Xem Chung' || item.label === 'Diễn viên') ? '#FFA726' : '#fff',
                    },
                    '&:active': { boxShadow: 'none', outline: 'none', background: 'none' },
                    '&:focus': { boxShadow: 'none', outline: 'none', background: 'none' },
                  }}
                >
                  {item.label}
                </Button>
              )
            ))}
          </Box>
          {/* Menu mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {menuItems.map((item) => (
                item.children ? (
                  <Box key={item.label}>
                    <MenuItem disabled>{item.label}</MenuItem>
                    {item.children.map((child) => (
                      <MenuItem key={child} sx={{ pl: 4 }}>{child}</MenuItem>
                    ))}
                    <Divider />
                  </Box>
                ) : (
                  <MenuItem key={item.label}>{item.label}</MenuItem>
                )
              ))}
            </Menu>
          </Box>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && user.username ? (
              <>
                <IconButton
                  sx={{
                    border: '2px solid #FFD600',
                    bgcolor: '#232a3b',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    boxShadow: 2,
                    '&:hover': {
                      bgcolor: '#232a3b',
                      '& .MuiSvgIcon-root': { color: '#fff' }
                    },
                    transition: 'none',
                  }}
                  onClick={handleNotificationClick}
                >
                  <NotificationsNoneIcon sx={{ color: '#fff', fontSize: 26 }} />
                </IconButton>
                <IconButton onClick={handleUserMenu} sx={{ p: 0, transition: 'none', '&:hover': { bgcolor: 'transparent' } }}>
                  <Avatar
                    src={user.avatar || undefined}
                    sx={{ width: 40, height: 40, border: '2px solid #fff', transition: 'none', '&:hover': { bgcolor: 'inherit' } }}
                  >
                    {!user.avatar && (user.username ? user.username[0].toUpperCase() : <PersonIcon />)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenu}
                  open={Boolean(userMenu)}
                  onClose={handleUserClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      bgcolor: '#232a3b',
                      color: '#fff',
                      minWidth: 200,
                      borderRadius: 3,
                      mt: 1.5,
                      boxShadow: 3,
                      p: 0,
                      overflow: 'visible',
                    }
                  }}
                >
                  <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                    <Typography variant="body2" color="#aaa">Chào,</Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="#FFD600">{user.username}</Typography>
                  </Box>
                  <Divider sx={{ bgcolor: '#333' }} />
                  <MenuItem sx={{ py: 1.2 }}><FavoriteBorderIcon sx={{ mr: 1 }} /> Yêu thích</MenuItem>
                  <MenuItem sx={{ py: 1.2 }}><AddIcon sx={{ mr: 1 }} /> Danh sách</MenuItem>
                  <MenuItem sx={{ py: 1.2 }}><HistoryIcon sx={{ mr: 1 }} /> Xem tiếp</MenuItem>
                  <MenuItem sx={{ py: 1.2 }}><AccountCircleIcon sx={{ mr: 1 }} /> Tài khoản</MenuItem>
                  <Divider sx={{ bgcolor: '#333' }} />
                  <MenuItem sx={{ py: 1.2 }} onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}><LogoutIcon sx={{ mr: 1 }} /> Thoát</MenuItem>
                </Menu>
                <Menu
                  anchorEl={notificationAnchor}
                  open={Boolean(notificationAnchor)}
                  onClose={handleNotificationClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      bgcolor: '#232a3b',
                      color: '#fff',
                      minWidth: 340,
                      maxWidth: 360,
                      borderRadius: 3,
                      mt: 1.5,
                      boxShadow: 6,
                      p: 0,
                      overflow: 'visible',
                    }
                  }}
                >
                  <Box sx={{ px: 2, pt: 2, pb: 0 }}>
                    <Tabs
                      value={notificationTab}
                      onChange={handleNotificationTab}
                      textColor="inherit"
                      TabIndicatorProps={{ sx: { bgcolor: '#FFD600', height: 3, borderRadius: 2 } }}
                      sx={{ minHeight: 36, mb: 1 }}
                    >
                      <Tab label="Phim" sx={{ color: notificationTab === 0 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 80 }} />
                      <Tab label="Cộng đồng" sx={{ color: notificationTab === 1 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 110 }} />
                      <Tab label="Đã đọc" sx={{ color: notificationTab === 2 ? '#FFD600' : '#fff', fontWeight: 600, minWidth: 90 }} />
                    </Tabs>
                  </Box>
                  <Divider sx={{ bgcolor: '#333', mb: 0.5 }} />
                  <Box sx={{ px: 2, py: 3, textAlign: 'center', color: '#bdbdbd', fontSize: 16, minHeight: 60 }}>
                    Không có thông báo nào
                  </Box>
                  <Divider sx={{ bgcolor: '#333', mt: 0.5 }} />
                  <Box sx={{ py: 1.5, textAlign: 'center', cursor: 'pointer', color: '#FFD600', fontWeight: 600, fontSize: 16, borderRadius: 0, transition: 'background 0.2s', '&:hover': { bgcolor: '#23242a' } }}>
                    Xem toàn bộ
                  </Box>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setOpenLogin(true)}
                startIcon={<PersonIcon />}
                sx={{
                  bgcolor: '#fff',
                  color: '#23242a',
                  borderRadius: 999,
                  fontWeight: 600,
                  px: 2,
                  boxShadow: 1,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Thành viên
              </Button>
            )}
          </Box>
        </Toolbar>
      </Box>
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} onRegister={() => { setOpenLogin(false); setOpenRegister(true); }} onForgot={() => { setOpenLogin(false); setOpenForgot(true); }} />
      <RegisterDialog open={openRegister} onClose={() => setOpenRegister(false)} onLogin={() => { setOpenRegister(false); setOpenLogin(true); }} />
      <ForgotPasswordDialog open={openForgot} onClose={() => setOpenForgot(false)} onLogin={() => { setOpenForgot(false); setOpenLogin(true); }} />
    </AppBar>
  );
} 