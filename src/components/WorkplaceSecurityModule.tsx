import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Avatar, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import WifiIcon from '@mui/icons-material/Wifi';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
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

const WorkplaceSecurityModule = () => {
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
      title: "Физическая безопасность рабочего места",
      content: "Основные правила физической безопасности:\n\n" +
        "1. Блокировка компьютера при отходе (Win + L)\n" +
        "2. Чистый стол - отсутствие конфиденциальных документов на виду\n" +
        "3. Безопасное хранение носителей информации\n" +
        "4. Ограничение доступа посторонних к рабочему месту\n" +
        "5. Правильная утилизация документов (использование шредера)",
      icon: <ComputerIcon fontSize="large" />,
      color: "#4361ee"
    },
    {
      title: "Безопасность программного обеспечения",
      content: "Меры по обеспечению безопасности ПО:\n\n" +
        "1. Регулярное обновление операционной системы\n" +
        "2. Использование антивирусного ПО\n" +
        "3. Установка только проверенного ПО\n" +
        "4. Регулярное резервное копирование данных\n" +
        "5. Использование корпоративного VPN при удаленной работе",
      icon: <ShieldIcon fontSize="large" />,
      color: "#3a0ca3"
    },
    {
      title: "Безопасность корпоративных данных",
      content: "Правила работы с корпоративной информацией:\n\n" +
        "1. Использование шифрования для конфиденциальных данных\n" +
        "2. Правильная классификация информации\n" +
        "3. Соблюдение политики доступа к данным\n" +
        "4. Осторожность при использовании съемных носителей\n" +
        "5. Запрет на передачу корпоративных данных через личные каналы связи",
      icon: <StorageIcon fontSize="large" />,
      color: "#4cc9f0"
    },
    {
      title: "Безопасность при удаленной работе",
      content: "Особенности безопасности при работе из дома:\n\n" +
        "1. Защищенное домашнее Wi-Fi соединение\n" +
        "2. Использование корпоративного VPN\n" +
        "3. Отдельное рабочее место\n" +
        "4. Соблюдение правил информационной безопасности как в офисе\n" +
        "5. Защита от посторонних глаз при работе с конфиденциальной информацией",
      icon: <WifiIcon fontSize="large" />,
      color: "#4ade80"
    }
  ];

  const questions: Question[] = [
    {
      id: 1,
      text: "Что нужно сделать перед тем, как отойти от рабочего компьютера?",
      options: [
        "Выключить компьютер",
        "Заблокировать компьютер (Win + L)",
        "Закрыть все программы",
        "Ничего не нужно делать"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Как правильно хранить конфиденциальные документы?",
      options: [
        "На рабочем столе для быстрого доступа",
        "В запираемом шкафу или сейфе",
        "В общей папке на компьютере",
        "На флешке в ящике стола"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Какое действие является правильным при работе с корпоративными данными?",
      options: [
        "Отправка файлов на личную почту для работы дома",
        "Копирование на личный компьютер",
        "Использование корпоративного VPN и шифрования",
        "Хранение паролей в текстовом файле"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "Что из перечисленного НЕ является безопасной практикой при удаленной работе?",
      options: [
        "Использование защищенного VPN",
        "Работа через публичный Wi-Fi без защиты",
        "Регулярное обновление антивируса",
        "Использование сложных паролей"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      text: "Как следует поступить с ненужными конфиденциальными документами?",
      options: [
        "Выбросить в обычную корзину",
        "Порвать и выбросить",
        "Уничтожить в шредере",
        "Сохранить на всякий случай"
      ],
      correctAnswer: 2
    }
  ];

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
      
      // Обновляем прогресс за каждую пройденную лекцию
      // Каждая лекция дает часть от 50% общего прогресса
      const lectureProgressPerSlide = 50 / lessons.length;
      const currentProgress = Math.round(lectureProgressPerSlide * (currentSlide + 1));
      updateModuleProgress('workplace-security', currentProgress);
    } else {
      setQuizStarted(true);
      // Обновляем прогресс при начале теста - 50% за все лекции
      updateModuleProgress('workplace-security', 50);
    }
  };

  const handleAnswerSubmit = (index: number) => {
    setSelectedOption(index);
    setShowAnswer(true);
    
    // Проверяем, правильный ли ответ
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Показываем правильный ответ на 1.5 секунды
    setTimeout(() => {
      setShowAnswer(false);
      
      // Переходим к следующему вопросу или завершаем тест
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      } else {
        // Вычисляем прогресс на основе правильных ответов
        const quizProgress = (score / questions.length) * 50;
        const totalProgress = 50 + quizProgress;
        
        // Проверяем, все ли ответы правильные
        const allCorrect = score === questions.length;
        updateModuleProgress('workplace-security', totalProgress, allCorrect);
      }
    }, 1500);
  };

  // Функция для возврата на главную страницу
  const handleFinish = () => {
    // Обновляем финальный прогресс до 100% только если все ответы правильные
    if (score === questions.length) {
      updateModuleProgress('workplace-security', 100, true);
    }
    // Возвращаемся на главную страницу
    navigate('/');
  };

  return (
    <Box>
      <Header />
      <AnimatedPage path="/workplace-security">
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
                    bgcolor: 'primary.main',
                    mb: 2,
                    boxShadow: '0 8px 16px rgba(67, 97, 238, 0.3)'
                  }}
                >
                  <BusinessCenterIcon sx={{ fontSize: 40 }} />
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
                  background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Безопасность рабочего места
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
                Узнайте, как обеспечить безопасность вашего рабочего места и защитить корпоративные данные
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
                  bgcolor: 'rgba(67, 97, 238, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
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
                  borderColor: currentSlide > 0 ? 'primary.main' : 'grey.300',
                  color: currentSlide > 0 ? 'primary.main' : 'grey.400',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'rgba(67, 97, 238, 0.05)',
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
                    background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
                    boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
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
                  endIcon={<SecurityIcon />}
                    variant="contained"
                    color="success"
                    sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)',
                    boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(74, 222, 128, 0.4)',
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
                      bgcolor: 'rgba(67, 97, 238, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
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
                        onClick={() => !showAnswer && handleAnswerSubmit(index)}
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
                             index === selectedOption ? 'error.main' : 'rgba(67, 97, 238, 0.3)') : 
                            'rgba(67, 97, 238, 0.3)',
                          color: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                             index === selectedOption ? 'error.main' : 'text.primary') : 
                            'text.primary',
                          bgcolor: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'rgba(74, 222, 128, 0.1)' : 
                             index === selectedOption ? 'rgba(248, 113, 113, 0.1)' : 'transparent') : 
                            'transparent',
                          fontSize: '1.1rem',
                          '&:hover': {
                            bgcolor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'rgba(74, 222, 128, 0.1)' : 
                               index === selectedOption ? 'rgba(248, 113, 113, 0.1)' : 'rgba(67, 97, 238, 0.05)') : 
                              'rgba(67, 97, 238, 0.05)',
                            borderColor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : 'primary.main') : 
                              'primary.main',
                            transform: !showAnswer ? 'translateY(-2px)' : 'none',
                            boxShadow: !showAnswer ? '0 4px 12px rgba(67, 97, 238, 0.15)' : 'none',
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
                                 index === selectedOption ? 'error.main' : 'rgba(67, 97, 238, 0.5)') : 
                                'rgba(67, 97, 238, 0.5)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : 'primary.main') : 
                              'primary.main'
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
                        bgcolor: score === questions.length ? '#4ade80' : score >= questions.length * 0.7 ? '#fbbf24' : '#f87171',
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
                            ? 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)' 
                            : score >= questions.length * 0.7 
                              ? 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)'
                              : 'linear-gradient(90deg, #f87171 0%, #dc2626 100%)',
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
                      ? "Отлично! Вы хорошо знаете правила безопасности на рабочем месте!" 
                      : score >= questions.length * 0.8 
                        ? "Хороший результат! Но есть место для улучшения."
                        : "Рекомендуем повторить материал для лучшего понимания правил безопасности."}
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
                          borderColor: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'rgba(67, 97, 238, 0.05)',
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
                        }}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          py: 1.2,
                          background: 'linear-gradient(90deg, #4361ee 0%, #3a0ca3 100%)',
                          boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
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

export default WorkplaceSecurityModule; 