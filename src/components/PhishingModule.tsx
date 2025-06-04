import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Avatar, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhishingIcon from '@mui/icons-material/PhishingOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';
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

const PhishingModule = () => {
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
      title: "Что такое фишинг?",
      content: "Фишинг - это вид мошенничества, при котором злоумышленники пытаются получить конфиденциальную информацию, маскируясь под надежные источники:\n\n" +
        "- Поддельные письма от банков\n" +
        "- Фальшивые сайты известных сервисов\n" +
        "- Мошеннические SMS и сообщения\n" +
        "- Поддельные уведомления в социальных сетях",
      icon: <PhishingIcon fontSize="large" />,
      color: "#ef476f"
    },
    {
      title: "Как распознать фишинговое письмо",
      content: "Основные признаки фишингового письма:\n\n" +
        "1. Срочность и угрозы ('Ваш аккаунт будет заблокирован через час')\n" +
        "2. Грамматические ошибки и опечатки\n" +
        "3. Странный адрес отправителя (например, support@g00gle.com)\n" +
        "4. Просьбы о конфиденциальной информации\n" +
        "5. Подозрительные вложения или ссылки",
      icon: <WarningAmberIcon fontSize="large" />,
      color: "#ffd166"
    },
    {
      title: "Защита от фишинга",
      content: "Основные меры защиты:\n\n" +
        "1. Никогда не переходите по подозрительным ссылкам\n" +
        "2. Проверяйте URL-адреса сайтов (https:// и правильное написание)\n" +
        "3. Не открывайте подозрительные вложения\n" +
        "4. Используйте двухфакторную аутентификацию\n" +
        "5. Не вводите личные данные на незнакомых сайтах",
      icon: <ShieldIcon fontSize="large" />,
      color: "#06d6a0"
    },
    {
      title: "Реальные примеры фишинга",
      content: "Распространенные сценарии фишинговых атак:\n\n" +
        "1. 'Ваш банковский счет заблокирован'\n" +
        "2. 'Выиграйте iPhone, просто перейдите по ссылке'\n" +
        "3. 'Подтвердите вашу учетную запись немедленно'\n" +
        "4. 'Проблема с доставкой посылки'\n" +
        "5. 'Обновите ваши платежные данные'",
      icon: <SecurityUpdateWarningIcon fontSize="large" />,
      color: "#118ab2"
    }
  ];

  const questions: Question[] = [
    {
      id: 1,
      text: "Какой из следующих адресов электронной почты вероятнее всего является фишинговым?",
      options: [
        "support@sberbank.ru",
        "support@sberbank.secure-login.com",
        "help@sberbank.ru",
        "info@sberbank.ru"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Что из перечисленного НЕ является признаком фишингового письма?",
      options: [
        "Срочные требования немедленных действий",
        "Официальное обращение по имени",
        "Грамматические ошибки",
        "Странный адрес отправителя"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Как следует поступить, если вы получили письмо от банка о блокировке карты?",
      options: [
        "Сразу перейти по ссылке в письме",
        "Позвонить в банк по номеру из письма",
        "Позвонить в банк по официальному номеру с карты",
        "Ответить на письмо"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "Какой URL-адрес наиболее вероятно ведет на настоящий сайт?",
      options: [
        "http://www.faceb00k.com",
        "https://www.facebook.com",
        "http://www.facebook.secure-login.com",
        "https://facebook.login-secure.com"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      text: "Что следует делать, если вы подозреваете, что стали жертвой фишинга?",
      options: [
        "Игнорировать проблему",
        "Немедленно сменить пароли и уведомить соответствующие организации",
        "Удалить все письма",
        "Отключить компьютер от интернета на неделю"
      ],
      correctAnswer: 1
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
      
      // Обновляем прогресс за каждую пройденную лекцию
      // Каждая лекция дает часть от 50% общего прогресса
      const lectureProgressPerSlide = 50 / lessons.length;
      const currentProgress = Math.round(lectureProgressPerSlide * (currentSlide + 1));
      updateModuleProgress('phishing', currentProgress);
    } else {
      setQuizStarted(true);
      // Обновляем прогресс при начале теста - 50% за все лекции
      updateModuleProgress('phishing', 50);
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
        updateModuleProgress('phishing', totalProgress, allCorrect);
      }
    }, 1000);
  };

  // Функция для возврата на главную страницу
  const handleFinish = () => {
    // Обновляем финальный прогресс до 100% только если все ответы правильные
    if (score === questions.length) {
      updateModuleProgress('phishing', 100, true);
    }
    // Возвращаемся на главную страницу
    navigate('/');
  };

  return (
    <Box>
      <Header />
      <AnimatedPage path="/phishing">
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
                    bgcolor: '#ef476f',
                    mb: 2,
                    boxShadow: '0 8px 16px rgba(239, 71, 111, 0.3)'
                  }}
                >
                  <PhishingIcon sx={{ fontSize: 40 }} />
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
                  background: 'linear-gradient(135deg, #ef476f 0%, #b5179e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Защита от фишинга
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
                Изучите методы распознавания и защиты от фишинговых атак
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
                  bgcolor: 'rgba(239, 71, 111, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #ef476f 0%, #b5179e 100%)',
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
                  borderColor: currentSlide > 0 ? '#ef476f' : 'grey.300',
                  color: currentSlide > 0 ? '#ef476f' : 'grey.400',
                  '&:hover': {
                    borderColor: '#d64665',
                    bgcolor: 'rgba(239, 71, 111, 0.05)',
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
                    background: 'linear-gradient(90deg, #ef476f 0%, #b5179e 100%)',
                    boxShadow: '0 4px 15px rgba(239, 71, 111, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(239, 71, 111, 0.4)',
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
                  endIcon={<PhishingIcon />}
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    background: 'linear-gradient(90deg, #06d6a0 0%, #06a77d 100%)',
                    boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(6, 214, 160, 0.4)',
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
                      bgcolor: 'rgba(239, 71, 111, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #ef476f 0%, #b5179e 100%)',
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
                             index === selectedOption ? 'error.main' : 'rgba(239, 71, 111, 0.3)') : 
                            'rgba(239, 71, 111, 0.3)',
                          color: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                             index === selectedOption ? 'error.main' : 'text.primary') : 
                            'text.primary',
                          bgcolor: showAnswer ? 
                            (index === questions[currentQuestion].correctAnswer ? 'rgba(6, 214, 160, 0.1)' : 
                             index === selectedOption ? 'rgba(239, 71, 111, 0.1)' : 'transparent') : 
                            'transparent',
                          fontSize: '1.1rem',
                        '&:hover': {
                            bgcolor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'rgba(6, 214, 160, 0.1)' : 
                               index === selectedOption ? 'rgba(239, 71, 111, 0.1)' : 'rgba(239, 71, 111, 0.05)') : 
                              'rgba(239, 71, 111, 0.05)',
                            borderColor: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : '#ef476f') : 
                              '#ef476f',
                            transform: !showAnswer ? 'translateY(-2px)' : 'none',
                            boxShadow: !showAnswer ? '0 4px 12px rgba(239, 71, 111, 0.15)' : 'none',
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
                                 index === selectedOption ? 'error.main' : 'rgba(239, 71, 111, 0.5)') : 
                                'rgba(239, 71, 111, 0.5)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: showAnswer ? 
                              (index === questions[currentQuestion].correctAnswer ? 'success.main' : 
                               index === selectedOption ? 'error.main' : '#ef476f') : 
                              '#ef476f'
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
                        bgcolor: score === questions.length ? '#06d6a0' : score >= questions.length * 0.7 ? '#ffd166' : '#ef476f',
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
                            ? 'linear-gradient(90deg, #06d6a0 0%, #06a77d 100%)' 
                            : score >= questions.length * 0.7 
                              ? 'linear-gradient(90deg, #ffd166 0%, #ffa94d 100%)'
                              : 'linear-gradient(90deg, #ef476f 0%, #b5179e 100%)',
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
                      ? "Отлично! Вы эксперт в распознавании фишинговых атак!" 
                      : score >= questions.length * 0.7 
                        ? "Хороший результат! Но будьте внимательнее при работе с электронной почтой."
                        : "Рекомендуем повторить материал. Фишинговые атаки могут быть очень опасны."}
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
                          borderColor: '#ef476f',
                          color: '#ef476f',
                          '&:hover': {
                            borderColor: '#d64665',
                            bgcolor: 'rgba(239, 71, 111, 0.05)',
                          },
                        }}
                      >
                        Вернуться на главную
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
                          background: 'linear-gradient(90deg, #ef476f 0%, #b5179e 100%)',
                          boxShadow: '0 4px 15px rgba(239, 71, 111, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(239, 71, 111, 0.4)',
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

export default PhishingModule; 