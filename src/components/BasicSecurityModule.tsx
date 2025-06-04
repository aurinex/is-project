import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, LinearProgress, Avatar, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import GppGoodIcon from '@mui/icons-material/GppGood';
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

const BasicSecurityModule = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  
  // Добавляем состояние для отслеживания прогресса пользователя
  // const [completed, setCompleted] = useState<boolean[]>([false, false, false]);
  
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
          console.log('Загружен прогресс модуля basic-security:', data['basic-security'] || 0);
        }
      } catch (error) {
        console.error('Ошибка при загрузке прогресса пользователя:', error);
      }
    };
    
    loadUserProgress();
  }, []);

  const lessons = [
    {
      title: "Что такое информационная безопасность?",
      content: "Информационная безопасность - это защита информации и информационных систем от несанкционированного доступа, использования, раскрытия, искажения, изменения, исследования, записи или уничтожения.\n\nОна включает в себя меры по защите данных как в цифровом, так и в физическом виде, а также процедуры и политики, направленные на предотвращение угроз и минимизацию рисков.\n\nВ современном мире информационная безопасность становится все более важной в связи с ростом киберугроз и увеличением объема конфиденциальных данных.",
      icon: <SecurityIcon fontSize="large" />,
      color: "#4361ee"
    },
    {
      title: "Основные принципы информационной безопасности",
      content: "Информационная безопасность основывается на трех ключевых принципах:\n\n1. Конфиденциальность - обеспечение доступа к информации только авторизованным пользователям. Это гарантирует, что данные доступны только тем, кто имеет соответствующие права.\n\n2. Целостность - защита точности и полноты информации. Этот принцип обеспечивает, что данные не были изменены несанкционированным образом.\n\n3. Доступность - обеспечение доступа к информации при необходимости. Этот принцип гарантирует, что авторизованные пользователи могут получить доступ к данным, когда это необходимо.",
      icon: <ShieldIcon fontSize="large" />,
      color: "#3a0ca3"
    },
    {
      title: "Угрозы информационной безопасности",
      content: "Существует множество угроз информационной безопасности:\n\n• Вредоносное ПО - программы, созданные для нанесения вреда компьютерным системам (вирусы, трояны, шпионское ПО)\n\n• Фишинговые атаки - попытки получить конфиденциальную информацию путем маскировки под надежный источник\n\n• Социальная инженерия - манипуляция людьми с целью получения доступа к конфиденциальной информации\n\n• Утечка данных - несанкционированная передача данных за пределы организации\n\n• Слабые пароли - легко угадываемые комбинации символов, которые не обеспечивают должной защиты\n\n• DDoS-атаки - попытки сделать ресурс недоступным путем перегрузки его запросами",
      icon: <PrivacyTipIcon fontSize="large" />,
      color: "#4cc9f0"
    },
    {
      title: "Методы защиты информации",
      content: "Для обеспечения информационной безопасности используются различные методы защиты:\n\n• Шифрование данных - преобразование информации в код, который можно расшифровать только с помощью ключа\n\n• Многофакторная аутентификация - использование нескольких способов подтверждения личности\n\n• Регулярное обновление ПО - установка патчей безопасности для устранения уязвимостей\n\n• Резервное копирование - создание копий данных для восстановления в случае потери\n\n• Обучение персонала - повышение осведомленности сотрудников о правилах безопасности\n\n• Использование брандмауэров и антивирусов - защита от вредоносных программ и несанкционированного доступа",
      icon: <GppGoodIcon fontSize="large" />,
      color: "#4ade80"
    }
  ];

  const questions: Question[] = [
    {
      id: 1,
      text: "Что из перечисленного является основным принципом информационной безопасности?",
      options: ["Скорость", "Конфиденциальность", "Сложность", "Размер"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Какая из перечисленных угроз НЕ относится к информационной безопасности?",
      options: ["Фишинг", "Медленный интернет", "Вредоносное ПО", "Социальная инженерия"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Что такое многофакторная аутентификация?",
      options: [
        "Использование нескольких паролей одновременно",
        "Использование нескольких способов подтверждения личности",
        "Использование нескольких компьютеров",
        "Использование нескольких антивирусов"
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      text: "Какой из принципов обеспечивает, что данные доступны только тем, кто имеет соответствующие права?",
      options: [
        "Доступность",
        "Целостность",
        "Конфиденциальность",
        "Прозрачность"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      text: "Что из перечисленного является лучшей практикой для защиты информации?",
      options: [
        "Использовать один пароль для всех учетных записей",
        "Никогда не обновлять программное обеспечение",
        "Регулярно создавать резервные копии данных",
        "Делиться конфиденциальной информацией в социальных сетях"
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
      updateModuleProgress('basic-security', currentProgress);
    } else {
      // Если это последний слайд, запускаем тест и обновляем прогресс
      setQuizStarted(true);
      // Обновляем прогресс - 50% за все лекции
      updateModuleProgress('basic-security', 50);
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
        updateModuleProgress('basic-security', totalProgress, allCorrect);
      }
    }, 1000);
  };

  // Заменяем существующую функцию handleFinish
  const handleFinish = () => {
    // Обновляем финальный прогресс до 100% только если все ответы правильные
    if (score === questions.length) {
      updateModuleProgress('basic-security', 100, true);
    }
    // Возвращаемся на главную страницу
    navigate('/');
  };

  return (
    <Box>
      <Header />
      <AnimatedPage path="/basic-security">
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
                  <SecurityIcon sx={{ fontSize: 40 }} />
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
                Основы информационной безопасности
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
                Изучите базовые принципы и концепции информационной безопасности
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
                      ? "Отлично! Вы хорошо усвоили основы информационной безопасности!" 
                      : score >= questions.length * 0.7 
                        ? "Хороший результат! Но есть место для улучшения."
                        : "Рекомендуем повторить материал для лучшего понимания основ информационной безопасности."}
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
                          setSelectedOption(null);
                          setShowAnswer(false);
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

export default BasicSecurityModule; 