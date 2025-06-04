import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  IconButton, 
  LinearProgress, 
  Paper, 
  Tab,
  Tabs,
  TextField,
  Badge,
  CircularProgress,
  Alert,
  Container,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import PhishingIcon from '@mui/icons-material/Phishing';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import Header from './Header';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';

// Анимации
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Стилизованные компоненты
const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  // '&:hover': {
  //   boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  //   transform: 'translateY(-5px)',
  // }
}));

const ModuleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  border: '4px solid white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(0,0,0,0.05)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface UserProgressData {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  averageProgress: number;
  completedModules: number;
  lastCompletionTime: Date;
  lastUpdated: Date;
  moduleCompletionTimes?: Record<string, string>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Input = styled('input')({
  display: 'none',
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({
    'basic-security': 0,
    'password-security': 0,
    'phishing': 0,
    'workplace-security': 0
  });
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [topUsers, setTopUsers] = useState<UserProgressData[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Модули обучения
  const modules = [
    {
      id: 'basic-security',
      title: 'Основы информационной безопасности',
      icon: <SecurityIcon sx={{ fontSize: 24 }} />,
      color: '#0f4c81',
      path: '/basic-security'
    },
    {
      id: 'password-security',
      title: 'Безопасность паролей',
      icon: <LockIcon sx={{ fontSize: 24 }} />,
      color: '#2c7da0',
      path: '/password-security'
    },
    {
      id: 'phishing',
      title: 'Защита от фишинга',
      icon: <PhishingIcon sx={{ fontSize: 24 }} />,
      color: '#468faf',
      path: '/phishing'
    },
    {
      id: 'workplace-security',
      title: 'Безопасность рабочего места',
      icon: <BusinessCenterIcon sx={{ fontSize: 24 }} />,
      color: '#61a5c2',
      path: '/workplace-security'
    }
  ];

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setIsOffline(!navigator.onLine);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/auth');
          return;
        }
        
        // Устанавливаем базовую информацию из объекта пользователя
        setDisplayName(currentUser.displayName || 'Пользователь');
        setNewDisplayName(currentUser.displayName || 'Пользователь');
        setPhotoURL(currentUser.photoURL || '');
        setEmail(currentUser.email || '');
        
        // Пробуем загрузить аватарку из localStorage
        try {
          const localAvatar = localStorage.getItem(`userAvatar_${currentUser.uid}`);
          if (localAvatar) {
            console.log('Аватар загружен из localStorage');
            setPhotoURL(localAvatar);
          }
        } catch (e) {
          console.error('Ошибка при загрузке аватара из localStorage:', e);
        }
        
        // Загружаем прогресс пользователя из локального хранилища
        const localData = localStorage.getItem(`userProgress_${currentUser.uid}`);
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            setUserProgress(parsedData);
          } catch (e) {
            console.error('Ошибка при чтении локальных данных:', e);
          }
        }
        
        if (navigator.onLine) {
          // Загружаем прогресс из Firestore
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
          
          // Загружаем топ пользователей
          await fetchTopUsers();
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        setError('Не удалось загрузить данные профиля');
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Загрузка топ пользователей
  const fetchTopUsers = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      // Получаем всех пользователей с прогрессом
      const usersRef = collection(db, 'userProgress');
      const usersSnapshot = await getDocs(usersRef);
      
      // Преобразуем данные и вычисляем средний прогресс
      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        const totalModules = 4; // Общее количество модулей
        let completedModules = 0;
        let totalProgress = 0;
        
        // Подсчитываем прогресс по всем модулям
        if (data['basic-security']) totalProgress += data['basic-security'];
        if (data['password-security']) totalProgress += data['password-security'];
        if (data['phishing']) totalProgress += data['phishing'];
        if (data['workplace-security']) totalProgress += data['workplace-security'];
        
        // Подсчитываем завершенные модули
        if (data['basic-security'] === 100) completedModules++;
        if (data['password-security'] === 100) completedModules++;
        if (data['phishing'] === 100) completedModules++;
        if (data['workplace-security'] === 100) completedModules++;
        
        const averageProgress = totalProgress / totalModules;
        
        // Определяем время последнего завершения
        let lastCompletionTime = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
        
        // Если у пользователя есть данные о времени завершения модулей, используем их
        if (data.moduleCompletionTimes) {
          const completionTimes = Object.values(data.moduleCompletionTimes);
          if (completionTimes.length > 0) {
            // Находим самое последнее время завершения модуля с корректным приведением типов
            const timestamps = completionTimes.map(time => {
              try {
                return new Date(time as string).getTime();
              } catch (e) {
                return 0;
              }
            });
            if (timestamps.length > 0 && Math.max(...timestamps) > 0) {
              const latestCompletion = new Date(Math.max(...timestamps));
              lastCompletionTime = latestCompletion;
            }
          }
        }
        
        return {
          id: doc.id,
          userId: data.userId || doc.id,
          email: data.email || 'Неизвестно',
          displayName: data.displayName || data.email || 'Пользователь',
          photoURL: data.photoURL || '',
          averageProgress,
          completedModules,
          lastCompletionTime,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
          moduleCompletionTimes: data.moduleCompletionTimes || {}
        };
      });
      
      // Сортируем сначала по количеству завершенных модулей (по убыванию)
      // При равном количестве - по времени завершения (кто раньше, тот выше)
      const sortedUsers = usersData.sort((a, b) => {
        // Сначала сравниваем по количеству завершенных модулей
        if (b.completedModules !== a.completedModules) {
          return b.completedModules - a.completedModules;
        }
        
        // Если количество модулей одинаковое, сравниваем по среднему прогрессу
        if (b.averageProgress !== a.averageProgress) {
          return b.averageProgress - a.averageProgress;
        }
        
        // Если и прогресс одинаковый, сравниваем по времени последнего обновления
        // Тот, кто завершил раньше, будет выше
        return a.lastCompletionTime.getTime() - b.lastCompletionTime.getTime();
      });
      
      // Получаем топ-10 пользователей
      const top10Users = sortedUsers.slice(0, 10);
      setTopUsers(top10Users);
      
      // Определяем ранг текущего пользователя
      const currentUserIndex = sortedUsers.findIndex(user => user.userId === currentUser.uid);
      if (currentUserIndex !== -1) {
        setUserRank(currentUserIndex + 1);
      }
    } catch (error) {
      console.error('Ошибка при загрузке топ пользователей:', error);
    }
  };

  // Загрузка новой аватарки
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      setUploadingPhoto(true);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setUploadingPhoto(false);
        return;
      }
      
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        setError('Выберите файл изображения');
        setShowError(true);
        setUploadingPhoto(false);
        return;
      }
      
      try {
        // Создаем уникальное имя файла с временной меткой
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `avatar_${Date.now()}.${fileExtension}`;
        const filePath = `avatars/${currentUser.uid}/${fileName}`;
        
        // Создаем ссылку на хранилище
        const storageRef = ref(storage, filePath);
        
        console.log('Начинаем загрузку файла:', filePath);
        
        // Загружаем файл с обработкой ошибок
        const uploadResult = await uploadBytes(storageRef, file);
        console.log('Файл загружен успешно:', uploadResult);
        
        // Получаем URL загруженного файла
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Получен URL файла:', downloadURL);
        
        // Обновляем профиль пользователя
        await updateProfile(currentUser, {
          photoURL: downloadURL
        });
        
        // Обновляем состояние приложения
        setPhotoURL(downloadURL);
        
        console.log('Аватар успешно загружен и применен');
        
        // Также обновляем запись в Firestore для сохранения данных
        try {
          const userDocRef = doc(db, 'userProgress', currentUser.uid);
          await updateDoc(userDocRef, {
            photoURL: downloadURL,
            lastUpdated: new Date().toISOString()
          });
        } catch (firestoreError) {
          console.error('Ошибка при обновлении Firestore:', firestoreError);
        }
        
        // Очищаем ошибки
        setError(null);
        setShowError(false);
        
      } catch (uploadError) {
        console.error('Ошибка при загрузке/обновлении:', uploadError);
        setError('Не удалось загрузить или обновить фото');
        setShowError(true);
      }
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      setError('Не удалось загрузить фото');
      setShowError(true);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Обновление имени пользователя
  const handleUpdateDisplayName = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      // Используем метод updateProfile из firebase/auth
      try {
        await updateProfile(currentUser, {
          displayName: newDisplayName
        });
        
        setDisplayName(newDisplayName);
        setIsEditing(false);
      } catch (error) {
        console.error('Ошибка при обновлении имени:', error);
        setError('Не удалось обновить имя');
        setShowError(true);
      }
    } catch (error) {
      console.error('Ошибка при обновлении имени:', error);
      setError('Не удалось обновить имя');
      setShowError(true);
    }
  };

  // Вычисляем общий прогресс
  const calculateTotalProgress = () => {
    const values = Object.values(userProgress);
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  };

  // Обработка изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Форматирование даты для отображения
  const formatDate = (date: Date): string => {
    try {
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Недоступно';
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          pt: '100px', // Отступ для хедера
          pb: 5,
          background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
        }}
      >
        <Container maxWidth="lg">
          {/* Хлебные крошки */}
          <Breadcrumbs sx={{ mb: 3, mt: 2 }}>
            <MuiLink 
              component={Link} 
              to="/" 
              underline="hover" 
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Главная
            </MuiLink>
            <Typography color="text.primary">Профиль</Typography>
          </Breadcrumbs>

          {/* Уведомления об ошибках */}
          {showError && (
            <Alert 
              severity="error" 
              onClose={() => setShowError(false)}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <CircularProgress size={60} />
              <Typography sx={{ ml: 2 }}>
                Загрузка профиля...
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Шапка профиля */}
              <Fade in={!loading} timeout={700}>
                <GradientCard sx={{ mb: 4 }}>
                  <Box sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Декоративные элементы */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: '-30%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                        animation: `${float} 8s infinite ease-in-out`
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        bottom: '-20%',
                        left: '10%',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                        animation: `${float} 12s infinite ease-in-out`
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <label htmlFor="icon-button-file">
                              <Input 
                                accept="image/*" 
                                id="icon-button-file" 
                                type="file" 
                                onChange={handlePhotoUpload}
                                disabled={uploadingPhoto}
                              />
                              <Zoom in={!uploadingPhoto}>
                                <IconButton 
                                  component="span" 
                                  sx={{ 
                                    bgcolor: 'white',
                                    '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.1)' },
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s'
                                  }}
                                  disabled={uploadingPhoto}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Zoom>
                              <Fade in={uploadingPhoto}>
                                <CircularProgress size={20} sx={{ 
                                  position: 'absolute',
                                  bottom: 10,
                                  right: 10,
                                  color: 'white'
                                }} />
                              </Fade>
                            </label>
                          }
                        >
                          <StyledAvatar 
                            src={photoURL} 
                            sx={{ 
                              width: 120, 
                              height: 120,
                            }}
                          >
                            {!photoURL && <PersonIcon sx={{ fontSize: 60 }} />}
                          </StyledAvatar>
                        </Badge>
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box>
                          {isEditing ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <TextField
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.15)', 
                                  borderRadius: 2,
                                  input: { color: 'white' }
                                }}
                              />
                              <Button 
                                variant="contained" 
                                onClick={handleUpdateDisplayName}
                                sx={{ 
                                  bgcolor: 'white', 
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  '&:hover': { 
                                    bgcolor: '#f0f0f0',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                  },
                                  transition: 'all 0.3s'
                                }}
                              >
                                Сохранить
                              </Button>
                              <Button 
                                variant="outlined" 
                                onClick={() => {
                                  setIsEditing(false);
                                  setNewDisplayName(displayName);
                                }}
                                sx={{ 
                                  borderColor: 'white', 
                                  color: 'white',
                                  '&:hover': { 
                                    borderColor: '#f0f0f0', 
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    transform: 'translateY(-2px)'
                                  },
                                  transition: 'all 0.3s'
                                }}
                              >
                                Отмена
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                                {displayName}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => setIsEditing(true)}
                                sx={{ 
                                  color: 'rgba(255,255,255,0.8)',
                                  '&:hover': { 
                                    color: 'white',
                                    transform: 'rotate(15deg)'
                                  },
                                  transition: 'all 0.3s'
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                          
                          <Typography sx={{ opacity: 0.9, mb: 2 }}>
                            {email}
                          </Typography>
                          
                          {userRank !== null && (
                            <Box 
                              sx={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                bgcolor: 'rgba(255,255,255,0.15)', 
                                px: 2, 
                                py: 0.5, 
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <EmojiEventsIcon sx={{ fontSize: 18, mr: 1, color: userRank <= 3 ? '#FFD700' : 'inherit' }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {userRank === 1 
                                  ? 'Лидер рейтинга!' 
                                  : `Место в рейтинге: ${userRank}`}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        minWidth: 150, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                      }}>
                        <Paper sx={{ 
                          px: 3, 
                          py: 2, 
                          bgcolor: 'rgba(255,255,255,0.9)',
                          borderRadius: 4,
                          textAlign: 'center',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <Typography variant="h3" sx={{ 
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}>
                            {Math.round(calculateTotalProgress())}%
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary', 
                            fontWeight: 500 
                          }}>
                            Общий прогресс
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                </GradientCard>
              </Fade>
              
              {/* Вкладки */}
              <Fade in={!loading} timeout={900}>
                <GradientCard>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': {
                          py: 2,
                          fontWeight: 600,
                          transition: 'all 0.3s',
                          '&.Mui-selected': {
                            color: '#4f46e5'
                          }
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#4f46e5',
                          height: 3,
                          borderRadius: '3px 3px 0 0'
                        }
                      }}
                    >
                      <Tab label="Прогресс обучения" />
                      <Tab label="Рейтинг пользователей" />
                    </Tabs>
                  </Box>
                  
                  <CardContent sx={{ px: 3 }}>
                    {/* Вкладка прогресса */}
                    <TabPanel value={tabValue} index={0}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                          Прогресс по модулям обучения
                        </Typography>
                        <Box sx={{ 
                          ml: 2, 
                          px: 1.5, 
                          py: 0.5, 
                          bgcolor: '#4f46e5', 
                          color: 'white', 
                          borderRadius: 10,
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {modules.filter(m => userProgress[m.id] === 100).length} из {modules.length}
                        </Box>
                      </Box>
                      
                      {isOffline && (
                        <Alert 
                          severity="warning" 
                          icon={<CloudOffIcon />}
                          sx={{ mb: 3, borderRadius: 2 }}
                        >
                          Вы находитесь в офлайн-режиме. Показан локально сохраненный прогресс.
                        </Alert>
                      )}
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {modules.map((module, index) => (
                          <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={module.id}>
                            <ModuleCard>
                              <Box 
                                component={Link}
                                to={module.path}
                                sx={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Avatar
                                    sx={{ 
                                      bgcolor: module.color,
                                      mr: 2,
                                      width: 56,
                                      height: 56,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                  >
                                    {module.icon}
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                      {module.title}
                                    </Typography>
                                    {userProgress[module.id] === 100 ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                                          Модуль успешно завершен
                                        </Typography>
                                      </Box>
                                    ) : userProgress[module.id] > 0 ? (
                                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        В процессе обучения ({userProgress[module.id] < 50 ? 'Начальный уровень' : 'Продвинутый уровень'})
                                      </Typography>
                                    ) : (
                                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Обучение не начато
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box 
                                    sx={{ 
                                      position: 'relative', 
                                      width: 56, 
                                      height: 56,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <CircularProgress
                                      variant="determinate"
                                      value={userProgress[module.id]}
                                      size={56}
                                      thickness={4}
                                      sx={{
                                        color: userProgress[module.id] === 100 ? '#10b981' : module.color,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 700,
                                        color: userProgress[module.id] === 100 ? '#10b981' : module.color
                                      }}
                                    >
                                      {userProgress[module.id]}%
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ position: 'relative', mt: 1 }}>
                                  <ProgressBar
                                    variant="determinate"
                                    value={userProgress[module.id]}
                                    sx={{
                                      '& .MuiLinearProgress-bar': {
                                        background: userProgress[module.id] === 100 
                                          ? 'linear-gradient(90deg, #10b981, #059669)' 
                                          : `linear-gradient(90deg, ${module.color}, ${module.color}dd)`,
                                      }
                                    }}
                                  />
                                </Box>
                              </Box>
                            </ModuleCard>
                          </Zoom>
                        ))}
                      </Box>
                    </TabPanel>
                    
                    {/* Вкладка рейтинга */}
                    <TabPanel value={tabValue} index={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#4f46e5' }}>
                          Рейтинг пользователей
                        </Typography>
                        {userRank !== null && (
                          <Box sx={{ 
                            ml: 2, 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: '#4f46e5', 
                            color: 'white', 
                            borderRadius: 10,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}>
                            <EmojiEventsIcon sx={{ fontSize: 16 }} />
                            {userRank === 1 ? 'Вы лидер!' : `Ваше место: ${userRank}`}
                          </Box>
                        )}
                      </Box>
                      
                      {isOffline ? (
                        <Alert 
                          severity="warning" 
                          icon={<CloudOffIcon />}
                          sx={{ mb: 3, borderRadius: 2 }}
                        >
                          Рейтинг недоступен в офлайн-режиме. Подключитесь к интернету для просмотра.
                        </Alert>
                      ) : loading ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          py: 5, 
                          flexDirection: 'column',
                          gap: 2 
                        }}>
                          <CircularProgress size={40} sx={{ color: '#4f46e5' }} />
                          <Typography sx={{ color: 'text.secondary' }}>
                            Загрузка рейтинга...
                          </Typography>
                        </Box>
                      ) : topUsers.length === 0 ? (
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 5,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <EmojiEventsIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
                          <Typography sx={{ color: 'text.secondary' }}>
                            Пока нет данных для отображения рейтинга.
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Alert 
                            severity="info" 
                            sx={{ 
                              mb: 3, 
                              borderRadius: 2,
                              backgroundColor: 'rgba(79, 70, 229, 0.1)',
                              color: '#4f46e5',
                              '& .MuiAlert-icon': {
                                color: '#4f46e5'
                              } 
                            }}
                          >
                            Рейтинг формируется на основе количества завершенных модулей и времени их прохождения. 
                            При одинаковом количестве модулей выше будет тот, кто завершил их раньше.
                          </Alert>
                          
                          <TableContainer 
                            component={Paper} 
                            sx={{ 
                              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                              borderRadius: '16px', 
                              overflow: 'hidden'
                            }}
                          >
                            <Table>
                              <TableHead sx={{ bgcolor: 'rgba(79, 70, 229, 0.08)' }}>
                                <TableRow>
                                  <TableCell align="center" width="60px">#</TableCell>
                                  <TableCell>Пользователь</TableCell>
                                  <TableCell align="center">Прогресс</TableCell>
                                  <TableCell align="center">Модули</TableCell>
                                  <TableCell align="center">Дата завершения</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {topUsers.map((user, index) => (
                                  <Zoom 
                                    in={true} 
                                    style={{ transitionDelay: `${index * 50}ms` }} 
                                    key={user.id}
                                  >
                                    <TableRow 
                                      sx={{ 
                                        bgcolor: user.userId === auth.currentUser?.uid ? 'rgba(79, 70, 229, 0.08)' : 'inherit',
                                        '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.05)' },
                                        transition: 'background-color 0.3s'
                                      }}
                                    >
                                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                        {index === 0 ? (
                                          <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            animation: `${pulse} 2s infinite ease-in-out`
                                          }}>
                                            <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                                          </Box>
                                        ) : index === 1 ? (
                                          <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            animation: `${pulse} 2.5s infinite ease-in-out`
                                          }}>
                                            <EmojiEventsIcon sx={{ color: '#C0C0C0' }} />
                                          </Box>
                                        ) : index === 2 ? (
                                          <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'center',
                                            animation: `${pulse} 3s infinite ease-in-out`
                                          }}>
                                            <EmojiEventsIcon sx={{ color: '#CD7F32' }} />
                                          </Box>
                                        ) : (
                                          <Box sx={{ 
                                            width: 24, 
                                            height: 24, 
                                            borderRadius: '50%', 
                                            bgcolor: 'rgba(79, 70, 229, 0.1)',
                                            color: '#4f46e5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                            mx: 'auto'
                                          }}>
                                            {index + 1}
                                          </Box>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                          <Avatar 
                                            src={user.photoURL} 
                                            sx={{ 
                                              width: 40, 
                                              height: 40,
                                              bgcolor: user.completedModules === 4 ? '#10b981' : '#4f46e5',
                                              border: user.userId === auth.currentUser?.uid ? '2px solid #4f46e5' : 'none',
                                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                            }}
                                          >
                                            {user.photoURL ? null : <PersonIcon />}
                                          </Avatar>
                                          <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                {user.displayName}
                                              </Typography>
                                              {user.completedModules === 4 && (
                                                <Tooltip title="Все модули завершены">
                                                  <VerifiedIcon sx={{ 
                                                    fontSize: 16, 
                                                    color: '#10b981',
                                                    animation: `${pulse} 3s infinite ease-in-out`
                                                  }} />
                                                </Tooltip>
                                              )}
                                              {index < 3 && (
                                                <Tooltip title={index === 0 ? "Лидер" : index === 1 ? "Второе место" : "Третье место"}>
                                                  <StarIcon sx={{ 
                                                    fontSize: 14, 
                                                    color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                                                    ml: 0.5
                                                  }} />
                                                </Tooltip>
                                              )}
                                            </Box>
                                            {user.userId === auth.currentUser?.uid && (
                                              <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                  color: '#4f46e5', 
                                                  fontWeight: 600,
                                                  bgcolor: 'rgba(79, 70, 229, 0.1)',
                                                  px: 0.8,
                                                  py: 0.2,
                                                  borderRadius: 1
                                                }}
                                              >
                                                Это вы
                                              </Typography>
                                            )}
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Box sx={{ width: '100%', mr: 1 }}>
                                            <ProgressBar 
                                              variant="determinate" 
                                              value={user.averageProgress} 
                                              sx={{
                                                '& .MuiLinearProgress-bar': {
                                                  background: user.averageProgress === 100 
                                                    ? 'linear-gradient(90deg, #10b981, #059669)' 
                                                    : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                                                  transition: 'transform 1s'
                                                }
                                              }}
                                            />
                                          </Box>
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                              minWidth: '40px',
                                              fontWeight: 700,
                                              color: user.averageProgress === 100 ? '#10b981' : '#4f46e5',
                                              textAlign: 'right'
                                            }}
                                          >
                                            {Math.round(user.averageProgress)}%
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Box sx={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'center',
                                          gap: 0.5
                                        }}>
                                          <Typography 
                                            sx={{ 
                                              fontWeight: 700,
                                              color: user.completedModules === 4 ? '#10b981' : '#4f46e5',
                                              display: 'flex',
                                              alignItems: 'center'
                                            }}
                                          >
                                            {user.completedModules}
                                            <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>/4</Typography>
                                          </Typography>
                                          
                                          <Box sx={{ display: 'flex', ml: 0.5 }}>
                                            {[...Array(4)].map((_, i) => (
                                              <Box 
                                                key={i}
                                                sx={{
                                                  width: 8,
                                                  height: 8,
                                                  borderRadius: '50%',
                                                  ml: 0.3,
                                                  bgcolor: i < user.completedModules 
                                                    ? (user.completedModules === 4 ? '#10b981' : '#4f46e5') 
                                                    : 'rgba(0,0,0,0.1)'
                                                }}
                                              />
                                            ))}
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell align="center">
                                        {user.completedModules > 0 ? (
                                          <Box 
                                            sx={{ 
                                              py: 0.5, 
                                              px: 1.5, 
                                              borderRadius: 2,
                                              bgcolor: 'rgba(79, 70, 229, 0.08)',
                                              display: 'inline-block'
                                            }}
                                          >
                                            <Typography 
                                              variant="body2"
                                              sx={{ 
                                                fontWeight: 500,
                                                color: '#4f46e5'
                                              }}
                                            >
                                              {formatDate(user.lastCompletionTime)}
                                            </Typography>
                                          </Box>
                                        ) : (
                                          <Typography 
                                            sx={{ 
                                              color: 'text.secondary',
                                              fontStyle: 'italic'
                                            }}
                                          >
                                            —
                                          </Typography>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </Zoom>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                    </TabPanel>
                  </CardContent>
                </GradientCard>
              </Fade>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ProfilePage; 