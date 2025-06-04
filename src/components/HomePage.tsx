import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Avatar, Paper, Container, Stack, LinearProgress, Tooltip, CircularProgress, Alert, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import PhishingIcon from '@mui/icons-material/Phishing';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import Header from './Header';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { placeholderImages } from '../assets/images';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const HomePage = () => {
  // Отслеживаем скролл для анимаций
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Добавляем состояние для интерактивного прогресса
  const [userProgress, setUserProgress] = useState<Record<string, number>>({
    'basic-security': 0,
    'password-security': 0,
    'phishing': 0,
    'workplace-security': 0
  });
  
  // Состояние для анимации прогресса
  const [animateProgress, setAnimateProgress] = useState(false);
  
  // Состояние загрузки данных пользователя
  const [loading, setLoading] = useState(true);
  
  // Состояние для отслеживания ошибок и режима офлайн
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Отслеживаем состояние сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // При восстановлении соединения можно попробовать загрузить данные снова
      fetchUserProgress();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setErrorMessage("Нет подключения к интернету. Работаем в офлайн-режиме.");
      setShowError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Проверяем текущее состояние сети
    setIsOffline(!navigator.onLine);
    if (!navigator.onLine) {
      setErrorMessage("Нет подключения к интернету. Работаем в офлайн-режиме.");
      setShowError(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Функция для загрузки прогресса пользователя
  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      
      // Проверяем наличие авторизованного пользователя
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
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
      if (!navigator.onLine) {
        setLoading(false);
        return;
      }
      
      try {
        // Пытаемся получить данные из Firestore
        const userProgressRef = doc(db, 'userProgress', currentUser.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (!userProgressDoc.exists()) {
          // Если документа нет, создаем его с начальными значениями
          const initialProgress = {
            'basic-security': 0,
            'password-security': 0,
            'phishing': 0,
            'workplace-security': 0,
            userId: currentUser.uid,
            email: currentUser.email,
            lastUpdated: new Date().toISOString()
          };
          
          try {
            await setDoc(userProgressRef, initialProgress);
            setUserProgress({
              'basic-security': 0,
              'password-security': 0,
              'phishing': 0,
              'workplace-security': 0
            });
            
            // Сохраняем в localStorage
            localStorage.setItem(
              `userProgress_${currentUser.uid}`, 
              JSON.stringify({
                'basic-security': 0,
                'password-security': 0,
                'phishing': 0,
                'workplace-security': 0
              })
            );
          } catch (error: unknown) {
            console.error('Ошибка при создании документа прогресса:', error);
          }
        } else {
          // Если документ существует, используем его данные
          const data = userProgressDoc.data();
          const progressData = {
            'basic-security': data['basic-security'] || 0,
            'password-security': data['password-security'] || 0,
            'phishing': data['phishing'] || 0,
            'workplace-security': data['workplace-security'] || 0
          };
          
          setUserProgress(progressData);
          
          // Обновляем локальное хранилище
          localStorage.setItem(
            `userProgress_${currentUser.uid}`, 
            JSON.stringify(progressData)
          );
        }
      } catch (error: unknown) {
        console.error('Ошибка при получении прогресса из Firestore:', error);
        
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'failed-precondition' || firebaseError.code === 'unavailable' || 
            firebaseError.message.includes('offline')) {
          setIsOffline(true);
          setErrorMessage("Не удалось подключиться к серверу. Работаем в офлайн-режиме.");
          setShowError(true);
        } else {
          setErrorMessage(`Ошибка при загрузке прогресса: ${firebaseError.message}`);
          setShowError(true);
        }
      }
    } catch (error: unknown) {
      console.error('Ошибка при получении прогресса пользователя:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Произошла ошибка: ${errorMessage}`);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Загружаем прогресс пользователя при монтировании компонента
  useEffect(() => {
    fetchUserProgress();
    
    // Задержка перед началом анимации прогресса
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Функция для обновления прогресса в Firestore и локально
  const handleProgressUpdate = async (moduleId: string): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      // Увеличиваем прогресс на 10%, но не более 100%
      const newValue = Math.min(100, userProgress[moduleId] + 10);
      
      // Обновляем локальное состояние
      setUserProgress(prev => {
        const updatedProgress = {
          ...prev,
          [moduleId]: newValue
        };
        
        // Сохраняем в localStorage
        localStorage.setItem(
          `userProgress_${currentUser.uid}`, 
          JSON.stringify(updatedProgress)
        );
        
        return updatedProgress;
      });
      
      // Если есть подключение к интернету, обновляем данные в Firestore
      if (navigator.onLine) {
        try {
          // Обновляем данные в Firestore
          const userProgressRef = doc(db, 'userProgress', currentUser.uid);
          await updateDoc(userProgressRef, {
            [moduleId]: newValue,
            lastUpdated: new Date().toISOString()
          });
        } catch (error: unknown) {
          console.error('Ошибка при обновлении прогресса в Firestore:', error);
          
          const firebaseError = error as FirebaseError;
          if (firebaseError.code === 'failed-precondition' || firebaseError.code === 'unavailable' || 
              firebaseError.message.includes('offline')) {
            setIsOffline(true);
            setErrorMessage("Не удалось сохранить прогресс на сервере. Данные сохранены локально.");
            setShowError(true);
          } else {
            setErrorMessage(`Ошибка при сохранении прогресса: ${firebaseError.message}`);
            setShowError(true);
          }
        }
      } else {
        // Если нет подключения, показываем уведомление
        setIsOffline(true);
        setErrorMessage("Прогресс сохранен локально. Синхронизация произойдет при подключении к интернету.");
        setShowError(true);
      }
    } catch (error: unknown) {
      console.error('Ошибка при обновлении прогресса:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Произошла ошибка: ${errorMessage}`);
      setShowError(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const modules = [
    {
      id: 'basic-security',
      title: 'Основы информационной безопасности',
      description: 'Изучите базовые принципы и концепции информационной безопасности, которые должен знать каждый.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      color: '#0f4c81',
      path: '/basic-security',
      image: placeholderImages.modules.basicSecurity
    },
    {
      id: 'password-security',
      title: 'Безопасность паролей',
      description: 'Узнайте, как создавать надежные пароли и правильно управлять ими для защиты ваших аккаунтов.',
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      color: '#2c7da0',
      path: '/password-security',
      image: placeholderImages.modules.passwordSecurity
    },
    {
      id: 'phishing',
      title: 'Защита от фишинга',
      description: 'Научитесь распознавать фишинговые атаки и защищаться от них в повседневной жизни.',
      icon: <PhishingIcon sx={{ fontSize: 40 }} />,
      color: '#468faf',
      path: '/phishing',
      image: placeholderImages.modules.phishing
    },
    {
      id: 'workplace-security',
      title: 'Безопасность рабочего места',
      description: 'Изучите правила безопасности на рабочем месте и при удаленной работе.',
      icon: <BusinessCenterIcon sx={{ fontSize: 40 }} />,
      color: '#61a5c2',
      path: '/workplace-security',
      image: placeholderImages.modules.workplaceSecurity
    }
  ];

  const features = [
    {
      id: 'interactive',
      title: 'Интерактивное обучение',
      description: 'Учитесь на практических примерах и интерактивных заданиях, которые помогут закрепить материал.',
      image: placeholderImages.features.interactive,
      color: '#0f4c81'
    },
    {
      id: 'certificate',
      title: 'Сертификат по окончании',
      description: 'Получите сертификат о прохождении курса по информационной безопасности.',
      image: placeholderImages.features.certificate,
      color: '#2c7da0'
    },
    {
      id: 'progress',
      title: 'Отслеживание прогресса',
      description: 'Следите за своим прогрессом и достижениями в процессе обучения.',
      image: placeholderImages.features.progress,
      color: '#468faf'
    }
  ];

  const statistics = [
    {
      id: 'data-breaches',
      value: '68%',
      title: 'Утечек данных',
      description: 'происходят из-за человеческих ошибок',
      image: placeholderImages.stats.dataBreaches
    },
    {
      id: 'phishing-attacks',
      value: '90%',
      title: 'Кибератак',
      description: 'начинаются с фишинговых писем',
      image: placeholderImages.stats.phishingAttacks
    },
    {
      id: 'password-theft',
      value: '81%',
      title: 'Взломов',
      description: 'происходят из-за слабых паролей',
      image: placeholderImages.stats.passwordTheft
    }
  ];

  // Анимационные варианты
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Настройки для слайдера
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
    customPaging: () => (
      <Box
        sx={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&.slick-active': {
            background: 'white',
            transform: 'scale(1.2)'
          }
        }}
      />
    )
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: scrolled 
        ? '#f0f4f8'
        : 'linear-gradient(to bottom, #f0f4f8, #e2e8f0)',
      position: 'relative'
    }}>
      {/* Уведомление об ошибке */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity={isOffline ? "warning" : "error"} 
          sx={{ width: '100%' }}
          icon={isOffline ? <CloudOffIcon /> : undefined}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      
      {/* Фоновые элементы */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        opacity: 0.4
      }}>
        <Box 
          sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="%23000" fill-opacity=".05"/%3E%3C/svg%3E")',
            backgroundSize: '20px 20px',
          }}
        />
        <Box 
          component={motion.div}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 300,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{ 
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15, 76, 129, 0.1) 0%, rgba(44, 125, 160, 0.05) 100%)',
            filter: 'blur(50px)'
          }}
        />
        <Box 
          component={motion.div}
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 200,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{ 
            position: 'absolute',
            bottom: '-30%',
            left: '-30%',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(70, 143, 175, 0.1) 0%, rgba(97, 165, 194, 0.05) 100%)',
            filter: 'blur(60px)'
          }}
        />
      </Box>

      <Header />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          pt: 8,
          zIndex: 1
        }}
      >
        <Container maxWidth="lg" sx={{ mb: '5vw'}}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: 1, p: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 2,
                    color: '#0f172a',
                    textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  Информационная безопасность
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4,
                    color: '#334155',
                    fontWeight: 400,
                    lineHeight: 1.5
                  }}
                >
                  Интерактивная платформа для изучения основ информационной безопасности и защиты данных
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  component={Link}
                  to="/basic-security"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: '8px',
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(90deg, #0f4c81 0%, #2c7da0 100%)',
                    boxShadow: '0 4px 15px rgba(15, 76, 129, 0.3)',
                    fontSize: '1.1rem',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(15, 76, 129, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Начать обучение
                </Button>
              </motion.div>
            </Box>
            
            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '100%',
                minHeight: '400px'
              }}
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateZ: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  zIndex: 2
                }}
              >
                <Box 
                  component={Paper}
                  elevation={10}
                  sx={{ 
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0f4c81 0%, #2c7da0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(15, 76, 129, 0.3)'
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 120, color: 'white' }} />
                </Box>
              </motion.div>
              
              <Box
                component={motion.div}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                sx={{
                  position: 'absolute',
                  width: '350px',
                  height: '350px',
                  borderRadius: '50%',
                  background: 'rgba(15, 76, 129, 0.2)',
                  filter: 'blur(30px)',
                  zIndex: 1
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Карусель изображений */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(to right, #1e293b, #334155)',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 -10px 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                mb: 6,
                fontWeight: 700,
                color: 'white'
              }}
            >
              Защита информации - наш приоритет
            </Typography>
          </motion.div>

          <Box sx={{ 
            maxWidth: '900px', 
            margin: '0 auto',
            '.slick-dots': {
              bottom: '-40px',
            }
          }}>
            <Slider {...sliderSettings}>
              {modules.map((module) => (
                <Box key={module.id}>
                  <Paper sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '400px',
                    position: 'relative',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)`,
                      zIndex: 1
                    }} />
                    
                    <Box 
                      component="img"
                      src={module.image}
                      alt={module.title}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 4,
                      zIndex: 2
                    }}>
                      <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                        {module.description}
                      </Typography>
                      <Button
                        component={Link}
                        to={module.path}
                        variant="contained"
                        sx={{
                          background: module.color,
                          '&:hover': {
                            background: module.color,
                            filter: 'brightness(1.1)'
                          }
                        }}
                      >
                        Подробнее
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Slider>
          </Box>
        </Container>
      </Box>

      {/* Модули обучения */}
      <Box sx={{ 
        py: 10, 
        background: '#fff',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 -10px 20px rgba(0,0,0,0.05)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Модули обучения
            </Typography>
            
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 6 }}
            >
              Выберите интересующий вас модуль и начните обучение
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={60} sx={{ color: 'var(--primary-color)' }} />
              </Box>
            ) : (
              <Stack spacing={3}>
                {modules.map((module) => (
                  <motion.div key={module.id} variants={itemVariants}>
                    <Card
                      sx={{
                        display: 'flex',
                        borderRadius: '16px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <CardContent sx={{ 
                        p: 4, 
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          mr: { xs: 0, sm: 4 },
                          mb: { xs: 3, sm: 0 },
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                          <Avatar
                            sx={{ 
                              bgcolor: module.color,
                              width: 80,
                              height: 80,
                              boxShadow: `0 8px 16px ${module.color}40`
                            }}
                          >
                            {module.icon}
                          </Avatar>
                        </Box>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h5" 
                            component="h2" 
                            sx={{ 
                              fontWeight: 700,
                              mb: 1,
                              color: '#0f172a'
                            }}
                          >
                            {module.title}
                          </Typography>
                          
                          <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ mb: 2 }}
                          >
                            {module.description}
                          </Typography>
                          
                          {/* Прогресс обучения */}
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                Прогресс обучения
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="bold" color={userProgress[module.id] === 100 ? 'success.main' : module.color}>
                                  {userProgress[module.id]}%
                                </Typography>
                                {userProgress[module.id] === 100 && (
                                  <CheckCircleIcon sx={{ ml: 0.5, fontSize: 16, color: 'success.main' }} />
                                )}
                                {isOffline && (
                                  <CloudOffIcon sx={{ ml: 0.5, fontSize: 16, color: 'warning.main' }} />
                                )}
                              </Box>
                            </Box>
                            <Tooltip title={`Прогресс: ${userProgress[module.id]}%${isOffline ? ' (офлайн режим)' : ''}`}>
                              <LinearProgress
                                variant="determinate"
                                value={animateProgress ? userProgress[module.id] : 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(0,0,0,0.05)',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    backgroundColor: userProgress[module.id] === 100 ? 'success.main' : module.color,
                                    transition: 'transform 1.5s ease-in-out'
                                  }
                                }}
                              />
                            </Tooltip>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box 
                              component={Link}
                              to={module.path}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: module.color,
                                fontWeight: 600,
                                textDecoration: 'none'
                              }}
                            >
                              <Typography sx={{ mr: 1 }}>
                                {userProgress[module.id] > 0 ? 'Продолжить обучение' : 'Начать обучение'}
                              </Typography>
                              <ArrowForwardIcon fontSize="small" />
                            </Box>
                            
                            {/* Кнопка для демонстрации обновления прогресса */}
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={userProgress[module.id] >= 100}
                              onClick={(e) => {
                                e.preventDefault();
                                handleProgressUpdate(module.id);
                              }}
                              sx={{ 
                                borderColor: module.color,
                                color: module.color,
                                '&:hover': {
                                  borderColor: module.color,
                                  backgroundColor: `${module.color}10`
                                }
                              }}
                            >
                              +10%
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Особенности обучения */}
      <Box sx={{ 
        py: 10, 
        background: '#f8fafc',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#0f172a'
              }}
            >
              Особенности обучения
            </Typography>
            
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 8 }}
            >
              Что делает наш курс по информационной безопасности особенным
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {features.map((feature, index) => (
              <Box 
                key={feature.id}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                sx={{ 
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setActiveFeature(index)}
              >
                <Paper
                  elevation={activeFeature === index ? 3 : 1}
                  sx={{
                    borderRadius: '16px',
                    p: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    background: activeFeature === index 
                      ? 'white'
                      : '#f8fafc',
                    transition: 'all 0.3s ease',
                    transform: activeFeature === index ? 'scale(1.02)' : 'scale(1)',
                    overflow: 'hidden',
                    border: activeFeature === index 
                      ? `1px solid ${feature.color}30`
                      : '1px solid #e2e8f0'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: { xs: '100%', md: '200px' },
                      height: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: activeFeature === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${feature.color}40 0%, ${feature.color}20 100%)`,
                        opacity: activeFeature === index ? 0.8 : 0.4,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        color: activeFeature === index ? feature.color : '#0f172a'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        color: activeFeature === index ? '#334155' : '#64748b'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Статистика */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(to right, #1e293b, #334155)',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                color: 'white'
              }}
            >
              Почему информационная безопасность важна
            </Typography>
            
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ mb: 8, color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Статистика, которая заставляет задуматься
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexWrap: 'nowrap', mx: '-16px' }}>
            {statistics.map((stat, index) => (
              <Box 
                key={stat.id}
                sx={{ 
                  width: { xs: '100%', md: '33.33%' },
                  px: 2,
                  mb: { xs: 4, md: 0 }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3
                    }}
                  >
                    <Box
                      component="img"
                      src={stat.image}
                      alt={stat.title}
                      sx={{
                        width: '80px',
                        height: '80px',
                        mb: 3,
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 800,
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      {stat.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 