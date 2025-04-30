import { useState } from 'react';
import AnimatedPage from './AnimatedPage';
import Header from './Header';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

  const lessons = [
    {
      title: "Основы безопасности паролей",
      content: "Пароль - это ваш ключ к цифровой безопасности. Надежный пароль должен быть:\n\n" +
        "- Длинным (минимум 12 символов)\n" +
        "- Содержать буквы, цифры и специальные символы\n" +
        "- Не включать личную информацию\n" +
        "- Уникальным для каждого сервиса"
    },
    {
      title: "Менеджеры паролей",
      content: "Менеджер паролей - это безопасное хранилище для ваших паролей:\n\n" +
        "- Генерирует сложные пароли\n" +
        "- Безопасно хранит их\n" +
        "- Автоматически заполняет формы\n" +
        "- Синхронизирует между устройствами\n\n" +
        "Популярные менеджеры: LastPass, 1Password, Bitwarden"
    },
    {
      title: "Двухфакторная аутентификация (2FA)",
      content: "2FA добавляет дополнительный уровень защиты:\n\n" +
        "- SMS-коды\n" +
        "- Приложения-аутентификаторы\n" +
        "- Физические ключи безопасности\n" +
        "- Биометрические данные\n\n" +
        "Даже если пароль скомпрометирован, злоумышленник не получит доступ без второго фактора."
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
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setQuizStarted(true);
    }
  };

  const handleAnswerSubmit = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Box>
      <Header />
      <AnimatedPage path="/password-security"
        sx={{
          maxWidth: '75vw',
          mx: 'auto',
          p: '2vw',
          minHeight: '40vw',
          bgcolor: 'background.paper',
          borderRadius: '1vw',
          boxShadow: 3,
          position: 'relative'
        }}>
        {!quizStarted ? (
          <>
            <Typography variant="h4" sx={{
              textAlign: 'center',
              mb: '2vw',
              fontWeight: 'bold',
              fontSize: '2vw'
            }}>
              {lessons[currentSlide].title}
            </Typography>

            <Box sx={{
              mb: '3vw',
              whiteSpace: 'pre-line',
              minHeight: '15vw',
              px: '2vw',
              fontSize: '1.2vw'
            }}>
              {lessons[currentSlide].content}
            </Box>
            
            {/* Навигационные кнопки */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              transform: 'translateY(-50%)',
              px: '2vw'
            }}>
              <IconButton 
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                sx={{
                  width: '3vw',
                  height: '3vw',
                  bgcolor: currentSlide > 0 ? 'primary.main' : 'grey.200',
                  color: currentSlide > 0 ? 'white' : 'grey.400',
                  '&:hover': {
                    bgcolor: currentSlide > 0 ? 'primary.dark' : 'grey.200',
                  },
                  transition: 'all 0.3s'
                }}
              >
                <ArrowBackIcon sx={{ fontSize: '1.5vw' }} />
              </IconButton>

              {currentSlide < lessons.length - 1 ? (
                <IconButton
                  onClick={handleNextSlide}
                  sx={{
                    width: '3vw',
                    height: '3vw',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: '1.5vw' }} />
                </IconButton>
              ) : (
                <Button
                  onClick={handleNextSlide}
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: '2.5vw',
                    px: '1.5vw',
                    py: '0.5vw',
                    fontSize: '1vw'
                  }}
                >
                  Начать тест
                </Button>
              )}
            </Box>

            {/* Индикатор прогресса */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5vw',
              position: 'absolute',
              bottom: '8vw',
              left: 0,
              right: 0
            }}>
              {lessons.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '0.8vw',
                    height: '0.8vw',
                    borderRadius: '50%',
                    bgcolor: index === currentSlide ? 'primary.main' : 'grey.400',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{
            maxWidth: '75vw',
            mx: 'auto',
            p: '2vw',
            minHeight: '40vw',
            bgcolor: 'transparent',
            borderRadius: '1vw',
            position: 'relative'
          }}>
            {currentQuestion < questions.length ? (
              <>
                <Typography variant="h4" sx={{ 
                  textAlign: 'center',
                  mb: '2vw',
                  fontWeight: 'bold',
                  fontSize: '2vw'
                }}>
                  Вопрос {currentQuestion + 1}
                </Typography>
                <Typography sx={{ 
                  textAlign: 'center',
                  mb: '1vw',
                  fontSize: '1.2vw'
                }}>
                  {questions[currentQuestion].text}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5vw',
                  mb: '6vw',
                  px: '2vw'
                }}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSubmit(index)}
                      variant="outlined"
                      sx={{
                        justifyContent: 'flex-start',
                        p: '1vw',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        fontSize: '1.2vw',
                        borderColor: 'grey.400',
                        color: 'text.primary',
                        borderRadius: '1.5vw',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>

                {/* Индикатор прогресса */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5vw',
                  position: 'absolute',
                  bottom: '8vw',
                  left: 0,
                  right: 0
                }}>
                  {questions.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '0.8vw',
                        height: '0.8vw',
                        borderRadius: '50%',
                        bgcolor: index === currentQuestion ? 'primary.main' : 'grey.400',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ 
                textAlign: 'center',
                minHeight: '40vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Typography variant="h4" sx={{ 
                  mb: '2vw', 
                  fontWeight: 'bold',
                  fontSize: '2vw'
                }}>
                  Тест завершен!
                </Typography>
                <Typography sx={{ 
                  fontSize: '1.5vw',
                  mb: '1vw'
                }}>
                  Ваш результат: {score} из {questions.length}
                </Typography>
                <Typography sx={{ 
                  fontSize: '1.2vw',
                  maxWidth: '50vw'
                }}>
                  {score === questions.length 
                    ? "Отлично! Вы отлично разбираетесь в безопасности паролей!" 
                    : "Попробуйте еще раз, чтобы улучшить свой результат!"}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </AnimatedPage>
    </Box>
  );
};

export default PasswordSecurityModule; 