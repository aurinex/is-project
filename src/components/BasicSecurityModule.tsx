import { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AnimatedPage from './AnimatedPage';
import Header from './Header';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const BasicSecurityModule = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const lessons = [
    {
      title: "Что такое информационная безопасность?",
      content: "Информационная безопасность - это защита информации и информационных систем от несанкционированного доступа, использования, раскрытия, искажения, изменения, исследования, записи или уничтожения."
    },
    {
      title: "Основные принципы информационной безопасности",
      content: "1. Конфиденциальность - обеспечение доступа к информации только авторизованным пользователям\n2. Целостность - защита точности и полноты информации\n3. Доступность - обеспечение доступа к информации при необходимости"
    },
    {
      title: "Угрозы информационной безопасности",
      content: "- Вредоносное ПО\n- Фишинговые атаки\n- Социальная инженерия\n- Утечка данных\n- Слабые пароли"
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
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setQuizStarted(true);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
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

  return (
    <Box>
      <Header />
      <AnimatedPage path="/basic-security"
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
                    ? "Отлично! Вы хорошо понимаете основы информационной безопасности!" 
                    : "Рекомендуем повторить материал для лучшего понимания основ безопасности."}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </AnimatedPage>
    </Box>
  );
};

export default BasicSecurityModule; 