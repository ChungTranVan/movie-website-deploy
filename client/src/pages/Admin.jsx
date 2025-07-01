import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import axios from 'axios';

export default function Admin() {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', poster_url: '', release_date: '', genre: '' });
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchMovies = () => {
    axios.get('http://localhost:5000/api/movies').then(res => setMovies(res.data));
  };
  useEffect(() => { fetchMovies(); }, []);

  if (!user.is_admin) return <Alert severity="error">Bạn không có quyền truy cập trang này!</Alert>;

  const handleOpen = (movie) => {
    setEditMovie(movie);
    setForm(movie || { title: '', description: '', poster_url: '', release_date: '', genre: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditMovie(null); setForm({ title: '', description: '', poster_url: '', release_date: '', genre: '' }); setError(''); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editMovie) {
        await axios.put(`http://localhost:5000/api/movies/${editMovie.id}`, { ...form, is_admin: true });
      } else {
        await axios.post('http://localhost:5000/api/movies', { ...form, is_admin: true });
      }
      fetchMovies(); handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa phim này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, { data: { is_admin: true } });
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', px: { xs: 1, md: 3 }, mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý phim</Typography>
      <Button variant="contained" onClick={() => handleOpen(null)} sx={{ mb: 2 }}>Thêm phim</Button>
      <Grid container spacing={3}>
        {movies.map(movie => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card sx={{ bgcolor: '#23242a', color: '#fff', borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: 6 } }}>
              <CardMedia component="img" height="350" image={movie.poster_url} alt={movie.title} />
              <CardContent>
                <Typography variant="h6" noWrap>{movie.title}</Typography>
                <Typography variant="body2" color="#aaa">{movie.genre}</Typography>
                <Typography variant="body2" color="#aaa">{movie.release_date}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpen(movie)}>Sửa</Button>
                <Button size="small" color="error" onClick={() => handleDelete(movie.id)}>Xóa</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMovie ? 'Sửa phim' : 'Thêm phim'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên phim" name="title" fullWidth margin="normal" value={form.title} onChange={handleChange} />
          <TextField label="Thể loại" name="genre" fullWidth margin="normal" value={form.genre} onChange={handleChange} />
          <TextField label="Ngày chiếu" name="release_date" type="date" fullWidth margin="normal" value={form.release_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Poster URL" name="poster_url" fullWidth margin="normal" value={form.poster_url} onChange={handleChange} />
          <TextField label="Mô tả" name="description" fullWidth margin="normal" multiline rows={3} value={form.description} onChange={handleChange} />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 