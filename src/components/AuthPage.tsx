import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../firebase';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: unknown) {
      let errorMessage = 'Произошла ошибка при аутентификации';
      
      if (error instanceof Error && 'code' in error) {
        const authError = error as AuthError;
        
        if (authError.code === 'auth/invalid-email') {
          errorMessage = 'Неверный формат email';
        } else if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
          errorMessage = 'Неверный email или пароль';
        } else if (authError.code === 'auth/email-already-in-use') {
          errorMessage = 'Пользователь с таким email уже существует';
        } else if (authError.code === 'auth/weak-password') {
          errorMessage = 'Пароль должен содержать не менее 6 символов';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Декоративные элементы для фона
  const decorations = [
    { 
      type: 'circle', 
      size: '300px', 
      color: 'rgba(76, 201, 240, 0.3)', 
      top: '10%', 
      left: '-5%',
      animation: 'float',
      duration: 15
    },
    { 
      type: 'blob', 
      size: '250px', 
      color: 'rgba(67, 97, 238, 0.2)', 
      top: '60%', 
      right: '-8%',
      animation: 'float',
      duration: 20
    },
    { 
      type: 'circle', 
      size: '150px', 
      color: 'rgba(58, 12, 163, 0.15)', 
      bottom: '5%', 
      left: '10%',
      animation: 'pulse',
      duration: 8
    },
    { 
      type: 'blob', 
      size: '100px', 
      color: 'rgba(76, 201, 240, 0.15)', 
      top: '20%', 
      right: '15%',
      animation: 'pulse',
      duration: 12
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      p: 2
    }}>
      {/* Декоративные элементы */}
      {decorations.map((item, index) => (
        <Box
          key={index}
          component={motion.div}
          sx={{
            position: 'fixed',
            width: item.size,
            height: item.size,
            borderRadius: item.type === 'circle' ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
            background: item.color,
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            zIndex: -1,
            filter: 'blur(40px)',
          }}
          animate={{
            y: item.animation === 'float' ? [0, -20, 0] : 0,
            scale: item.animation === 'pulse' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <Paper
        component={motion.div}
        elevation={10}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <Box 
              sx={{
                width: '70px',
                height: '70px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <SecurityIcon sx={{ color: 'white', fontSize: '40px' }} />
            </Box>
          </motion.div>
          
          <Typography 
            component={motion.h1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            ИнфоБезопасность
          </Typography>
          
          <Typography 
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 3, textAlign: 'center' }}
          >
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Пароль"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
              boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Войти' : 'Зарегистрироваться'
            )}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => setIsLogin(!isLogin)}
              sx={{ 
                textTransform: 'none',
                color: '#4361ee',
                '&:hover': {
                  background: 'rgba(67, 97, 238, 0.1)',
                }
              }}
            >
              {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;