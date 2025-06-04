import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Avatar, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PasswordIcon from '@mui/icons-material/Password';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updateModuleProgress } from './ModuleProgress';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const PasswordSecurityModule = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  // Загружаем текущий прогресс пользователя при монтировании компонента
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        const userProgressRef = doc(db, 'userProgress', currentUser.uid);
        const userProgressDoc = await getDoc(userProgressRef);
        
        if (userProgressDoc.exists()) {
          const data = userProgressDoc.data();
          console.log('Загружен прогресс:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке прогресса пользователя:', error);
      }
    };
    
    loadUserProgress();
  }, []);

  const lessons = [
    {
      title: "Основы безопасности паролей",
      content: "Пароль - это ваш ключ к цифровой безопасности. Надежный пароль должен быть:\n\n" +
        "- Длинным (минимум 12 символов)\n" +
        "- Содержать буквы, цифры и специальные символы\n" +
        "- Не включать личную информацию\n" +
        "- Уникальным для каждого сервиса",
      icon: <PasswordIcon fontSize="large" />,
      color: "#8338ec"
    },
    {
      title: "Менеджеры паролей",
      content: "Менеджер паролей - это безопасное хранилище для ваших паролей:\n\n" +
        "- Генерирует сложные пароли\n" +
        "- Безопасно хранит их\n" +
        "- Автоматически заполняет формы\n" +
        "- Синхронизирует между устройствами\n\n" +
        "Популярные менеджеры: LastPass, 1Password, Bitwarden",
      icon: <VpnKeyIcon fontSize="large" />,
      color: "#3a86ff"
    },
    {
      title: "Двухфакторная аутентификация (2FA)",
      content: "2FA добавляет дополнительный уровень защиты:\n\n" +
        "- SMS-коды\n" +
        "- Приложения-аутентификаторы\n" +
        "- Физические ключи безопасности\n" +
        "- Биометрические данные\n\n" +
        "Даже если пароль скомпрометирован, злоумышленник не получит доступ без второго фактора.",
      icon: <SecurityIcon fontSize="large" />,
      color: "#fb5607"
    }
  ];

  const questions: Question[] = [
    {
      id: 1,
      text: "Какой из следующих паролей самый надежный?",
      options: [
        "password123",
        "P@ssw0rd!2023",
        "моядатарождения",
        "кличкамоейсобаки"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Что такое двухфакторная аутентификация (2FA)?",
      options: [
        "Два разных пароля",
        "Дополнительный способ подтверждения личности",
        "Двойное шифрование",
        "Два разных логина"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Какое утверждение о менеджерах паролей верно?",
      options: [
        "Они небезопасны, так как хранят все пароли в одном месте",
        "Они усложняют использование паролей",
        "Они помогают создавать и хранить надежные пароли",
        "Они замедляют работу компьютера"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "Как часто рекомендуется менять пароли?",
      options: [
        "Никогда, если они надежные",
        "Каждую неделю",
        "При подозрении на компрометацию или утечку данных",
        "Каждый день"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      text: "Что НЕ следует использовать в качестве пароля?",
      options: [
        "Длинную фразу из нескольких слов",
        "Комбинацию случайных символов",
        "Свою дату рождения или имя питомца",
        "Пароль, содержащий специальные символы"
      ],
      correctAnswer: 2
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
      
      // Обновляем прогресс за каждую пройденную лекцию
      // Каждая лекция дает часть от 50% общего прогресса
      const lectureProgressPerSlide = 50 / lessons.length;
      const currentProgress = Math.round(lectureProgressPerSlide * (currentSlide + 1));
      updateModuleProgress('password-security', currentProgress);
    } else {
      setQuizStarted(true);
      // Обновляем прогресс при начале теста - 50% за все лекции
      updateModuleProgress('password-security', 50);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowAnswer(true);
    
    setTimeout(() => {
      // Проверяем, правильный ли ответ выбран
      const isCorrect = index === questions[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowAnswer(false);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        // Обновляем прогресс после завершения теста
        // 50% за лекции + процент за правильные ответы (до 50%)
        const testProgressPerQuestion = 50 / questions.length;
        const finalScore = score + (isCorrect ? 1 : 0);
        const testProgress = Math.round(testProgressPerQuestion * finalScore);
        const totalProgress = 50 + testProgress;
        
        // Проверяем, все ли ответы правильные
        const allCorrect = finalScore === questions.length;
        updateModuleProgress('password-security', totalProgress, allCorrect);
      }
    }, 1000);
  };

  // Функция для возврата на главную страницу
  const handleFinish = () => {
    // Обновляем финальный прогресс до 100% только если все ответы правильные
    if (score === questions.length) {
      updateModuleProgress('password-security', 100, true);
    }
    // Возвращаемся на главную страницу
    navigate('/');
  };

  return (
    <Box>
      <Header />
      <AnimatedPage path="/password-security">
        {!quizStarted ? (
          <Box>
            {/* Заголовок модуля */}
            <Box sx={{ 
              textAlign: 'center',
              mb: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#8338ec',
                    mb: 2,
                    boxShadow: '0 8px 16px rgba(131, 56, 236, 0.3)'
                  }}
                >
                  <PasswordIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </motion.div>
              
              <Typography 
                variant="h3" 
                component={motion.h1}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8338ec 0%, #3a86ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Безопасность паролей
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary"
                component={motion.p}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                sx={{ maxWidth: '700px' }}
              >
                Изучите принципы создания надежных паролей и методы их защиты
              </Typography>
            </Box>

            {/* Индикатор прогресса */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Урок {currentSlide + 1} из {lessons.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(((currentSlide + 1) / lessons.length) * 100)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={((currentSlide + 1) / lessons.length) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(131, 56, 236, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #8338ec 0%, #3a86ff 100%)',
                  }
                }}
              />
            </Box>

            {/* Содержимое урока */}
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                mb: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Декоративный элемент */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${lessons[currentSlide].color}33 0%, ${lessons[currentSlide].color}11 100%)`,
                  zIndex: 0
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ 
                      bgcolor: lessons[currentSlide].color,
                      mr: 2,
                      width: 56,
                      height: 56
                    }}
                  >
                    {lessons[currentSlide].icon}
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {lessons[currentSlide].title}
            </Typography>
                </Box>

                <Typography 
                  variant="body1" 
                  sx={{ 
              whiteSpace: 'pre-line',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: 'text.primary'
                  }}
                >
              {lessons[currentSlide].content}
                </Typography>
            </Box>
            </Paper>
            
            {/* Навигационные кнопки */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4
            }}>
              <Button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2,
                  borderColor: currentSlide > 0 ? '#8338ec' : 'grey.300',
                  color: currentSlide > 0 ? '#8338ec' : 'grey.400',
                  '&:hover': {
                    borderColor: '#7030d0',
                    bgcolor: 'rgba(131, 56, 236, 0.05)',
                  },
                  transition: 'all 0.3s'
                }}
              >
                Назад
              </Button>

              {currentSlide < lessons.length - 1 ? (
                <Button
                  onClick={handleNextSlide}
                  endIcon={<ArrowForwardIcon />}
                  variant="contained"
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(90deg, #8338ec 0%, #3a86ff 100%)',
                    boxShadow: '0 4px 15px rgba(131, 56, 236, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(131, 56, 236, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Далее
                </Button>
              ) : (
                <Button
                  onClick={handleNextSlide}
                  endIcon={<PasswordIcon />}
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(90deg, #3a86ff 0%, #0072ff 100%)',
                    boxShadow: '0 4px 15px rgba(58, 134, 255, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Начать тест
                </Button>
              )}
            </Box>
            </Box>
        ) : (
          <Box>
            {currentQuestion < questions.length ? (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Индикатор прогресса теста */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Вопрос {currentQuestion + 1} из {questions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={((currentQuestion + 1) / questions.length) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(131, 56, 236, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #8338ec 0%, #3a86ff 100%)',
                      }
                    }}
                  />
                </Box>
                
                {/* Вопрос */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    mb: 4
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 3,
                      color: '#333'
                    }}
                  >
                  {questions[currentQuestion].text}
                </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                        onClick={() => !showAnswer && handleOptionSelect(index)}
                      variant="outlined"
                        component={motion.button}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        disabled={showAnswer}
                      sx={{
                        justifyContent: 'flex-start',
                          p: 2,
                        textAlign: 'left',
                          borderRadius: '16px',
                          borderColor: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                             index === selectedOption ? 'error.main' : 'rgba(131, 56, 236, 0.3)') : 
                            'rgba(131, 56, 236, 0.3)',
                          color: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                             index === selectedOption ? 'error.main' : 'text.primary') : 
                            'text.primary',
                          bgcolor: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'rgba(58, 134, 255, 0.1)' : 
                             index === selectedOption ? 'rgba(131, 56, 236, 0.1)' : 'transparent') : 
                            'transparent',
                          fontSize: '1.1rem',
                        '&:hover': {
                            bgcolor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'rgba(58, 134, 255, 0.1)' : 
                               index === selectedOption ? 'rgba(131, 56, 236, 0.1)' : 'rgba(131, 56, 236, 0.05)') : 
                              'rgba(131, 56, 236, 0.05)',
                            borderColor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : '#8338ec') : 
                              '#8338ec',
                            transform: !showAnswer ? 'translateY(-2px)' : 'none',
                            boxShadow: !showAnswer ? '0 4px 12px rgba(131, 56, 236, 0.15)' : 'none',
                          },
                          transition: 'all 0.3s'
                        }}
                      >
                        <Box 
                          sx={{ 
                            mr: 2, 
                            width: 28, 
                            height: 28, 
                            borderRadius: '50%', 
                            border: `2px solid ${
                              showAnswer ? 
                                (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                                 index === selectedOption ? 'error.main' : 'rgba(131, 56, 236, 0.5)') : 
                                'rgba(131, 56, 236, 0.5)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : '#8338ec') : 
                              '#8338ec'
                          }}
                        >
                          {String.fromCharCode(65 + index)}
                        </Box>
                      {option}
                    </Button>
                  ))}
                </Box>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    textAlign: 'center'
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
                    <Avatar
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        bgcolor: score === questions.length ? '#3a86ff' : score >= questions.length * 0.7 ? '#fb8500' : '#f72585',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      {score === questions.length ? (
                        <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />
                      ) : (
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          {Math.round((score / questions.length) * 100)}%
                        </Typography>
                      )}
                    </Avatar>
                  </motion.div>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    Тест завершен!
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3,
                      color: score === questions.length ? '#15803d' : score >= questions.length * 0.7 ? '#b45309' : '#b91c1c',
                      fontWeight: 600
                    }}
                  >
                    Ваш результат: {score} из {questions.length}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(score / questions.length) * 100}
                      sx={{
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: score === questions.length 
                            ? 'linear-gradient(90deg, #3a86ff 0%, #0072ff 100%)' 
                            : score >= questions.length * 0.7 
                              ? 'linear-gradient(90deg, #fb8500 0%, #fd9e14 100%)'
                              : 'linear-gradient(90deg, #f72585 0%, #b5179e 100%)',
                        }
                      }}
                    />
                </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.2rem',
                      maxWidth: '600px',
                      mx: 'auto',
                      mb: 4,
                      color: 'text.secondary'
                    }}
                  >
                  {score === questions.length 
                      ? "Отлично! Вы отлично разбираетесь в вопросах безопасности паролей!" 
                      : score >= questions.length * 0.7 
                        ? "Хороший результат! Но не забывайте применять принципы безопасности паролей на практике."
                        : "Рекомендуем повторить материал. Безопасность паролей - важный аспект цифровой защиты."}
                </Typography>
                  
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Box>
                      <Button
                        variant="outlined"
                        onClick={handleFinish}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 1.2,
                          borderColor: '#8338ec',
                          color: '#8338ec',
                          '&:hover': {
                            borderColor: '#7030d0',
                            bgcolor: 'rgba(131, 56, 236, 0.05)',
                          },
                        }}
                      >
                        Вернуться к материалам
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setCurrentQuestion(0);
                          setScore(0);
                          setSelectedOption(null);
                          setShowAnswer(false);
                        }}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 1.2,
                          background: 'linear-gradient(90deg, #8338ec 0%, #3a86ff 100%)',
                          boxShadow: '0 4px 15px rgba(131, 56, 236, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(131, 56, 236, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Пройти тест снова
                      </Button>
              </Box>
                  </Stack>
                </Paper>
              </motion.div>
            )}
          </Box>
        )}
      </AnimatedPage>
    </Box>
  );
};

export default PasswordSecurityModule; 