import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Menu, MenuItem, Avatar, Badge, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import PhishingIcon from '@mui/icons-material/Phishing';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { motion } from 'framer-motion';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({
    'basic-security': 0,
    'password-security': 0,
    'phishing': 0,
    'workplace-security': 0
  });
  const location = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Загрузка прогресса пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        // Пытаемся получить данные из localStorage сначала
        const localData = localStorage.getItem(`userProgress_${currentUser.uid}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            setUserProgress(parsedData);
          } catch (e) {
            console.error('Ошибка при чтении локальных данных:', e);
          }
        }
        
        // Если нет подключения к интернету, используем только локальные данные
        if (!navigator.onLine) return;
        
        // Пытаемся получить данные из Firestore
        const userProgressRef = doc(db, 'userProgress', currentUser.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (userProgressDoc.exists()) {
          const data = userProgressDoc.data();
          const progressData = {
            'basic-security': data['basic-security'] || 0,
            'password-security': data['password-security'] || 0,
            'phishing': data['phishing'] || 0,
            'workplace-security': data['workplace-security'] || 0
          };
          
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error('Ошибка при получении прогресса пользователя:', error);
      }
    };
    
    fetchUserProgress();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
    handleClose();
  };

  // Обработчик перехода на страницу профиля
  const handleNavigateToProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const menuItems = [
    { path: '/basic-security', label: 'Основы безопасности', icon: <SecurityIcon />, id: 'basic-security' },
    { path: '/password-security', label: 'Безопасность паролей', icon: <LockIcon />, id: 'password-security' },
    { path: '/phishing', label: 'Фишинг', icon: <PhishingIcon />, id: 'phishing' },
    { path: '/workplace-security', label: 'Безопасность рабочего места', icon: <BusinessCenterIcon />, id: 'workplace-security' },
  ];

  return (
    <Box 
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled 
          ? '0 10px 30px rgba(0, 0, 0, 0.1)' 
          : 'none',
        transition: 'all 0.3s ease',
        padding: '1.8rem 2rem',
        color: scrolled ? '#333' : '#fff',
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 auto' }}>
        <Box 
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box 
              className="pulse-element"
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 0, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <SecurityIcon sx={{ color: 'white', fontSize: '24px' }} />
              </Box>
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle, transparent 30%, rgba(255, 255, 255, 0.1) 100%)',
                  opacity: 0.5
                }}
              />
            </Box>
            <Typography 
              variant="h6" 
              component={motion.h6}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                backgroundSize: '200% 200%'
              }}
            >
              ИнфоБезопасность
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setActiveIndex(index)}
              onHoverEnd={() => setActiveIndex(-1)}
            >
              <Tooltip 
                title={
                  <Box sx={{ 
                    p: 0.5, 
                    width: '220px',
                    borderRadius: '8px'
                  }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        color: userProgress[item.id] === 100 ? '#10b981' : '#4361ee'
                      }}
                    >
                      {item.label}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 1
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {userProgress[item.id] > 0 ? 'Прогресс обучения:' : 'Начните обучение'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 700,
                          color: userProgress[item.id] === 100 ? '#10b981' : '#4361ee'
                        }}
                      >
                        {userProgress[item.id]}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      height: '8px', 
                      borderRadius: '4px', 
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      overflow: 'hidden',
      position: 'relative',
                      mb: 1
                    }}>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${userProgress[item.id]}%`,
                          borderRadius: '4px',
                          background: userProgress[item.id] === 100 
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #4361ee, #3a0ca3)',
                          transition: 'width 0.5s ease-in-out'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ 
      display: 'flex',
                      alignItems: 'center', 
      justifyContent: 'space-between',
                      mt: 1
                    }}>
                      {userProgress[item.id] === 0 ? (
                        <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                          Нажмите, чтобы начать
                        </Typography>
                      ) : userProgress[item.id] === 100 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                            Завершено
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                          {userProgress[item.id] < 50 ? 'Только начали' : 'Почти завершено'}
                        </Typography>
                      )}
                      
                      {!navigator.onLine && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CloudOffIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                          <Typography variant="caption" sx={{ color: '#f59e0b' }}>
                            Офлайн
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                } 
                arrow
                placement="bottom"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'rgba(23, 25, 35, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      p: 1.5
                    }
                  },
                  arrow: {
                    sx: {
                      color: 'rgba(23, 25, 35, 0.95)'
                    }
                  }
                }}
              >
                <Button
                  component={Link}
                  to={item.path}
                  startIcon={
                    <Badge 
                      color={userProgress[item.id] === 100 ? "success" : "primary"} 
                      variant="dot" 
                      invisible={userProgress[item.id] === 0}
                    >
                      {item.icon}
                    </Badge>
                  }
                  sx={{
                    color: location.pathname === item.path 
                      ? (scrolled ? '#555' : '#555') 
                      : (scrolled ? '#555' : '#555'),
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    fontSize: '1.5rem',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': activeIndex === index ? {
                      content: '""',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'transparent',
                      borderRadius: '12px',
                      zIndex: -1
                    } : {},
                    '&:hover': {
                      background: 'transparent'
                    },
                    '&::after': location.pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '3px',
                      borderRadius: '3px',
                      backgroundColor: 'transparent',
                    } : {}
                  }}
                >
                  {item.label}
                </Button>
              </Tooltip>
            </motion.div>
          ))}
          
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip title="Ваши достижения" arrow>
                <IconButton 
                  size="small"
                  sx={{ 
                    mr: 1,
                    border: scrolled 
                      ? '2px solid rgba(76, 201, 240, 0.3)'
                      : '2px solid rgba(255, 255, 255, 0.3)',
                    padding: '4px'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      background: 'linear-gradient(135deg, #4cc9f0 0%, #3a0ca3 100%)'
                    }}
                  >
                    <EmojiEventsIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton 
                onClick={handleClick}
                size="small"
                sx={{ 
                  border: scrolled 
                    ? '2px solid rgba(67, 97, 238, 0.3)'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '4px'
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)'
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </motion.div>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                mt: 1.5,
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  margin: '4px',
                  padding: '10px 16px',
                  gap: 1.5
                },
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleNavigateToProfile}>
              <PersonIcon fontSize="small" />
              <Typography>Профиль</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
              <Typography>Выйти</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header; 