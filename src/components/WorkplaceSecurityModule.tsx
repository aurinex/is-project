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

const WorkplaceSecurityModule = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const lessons = [
    {
      title: "Физическая безопасность рабочего места",
      content: "Основные правила физической безопасности:\n\n" +
        "1. Блокировка компьютера при отходе (Win + L)\n" +
        "2. Чистый стол - отсутствие конфиденциальных документов на виду\n" +
        "3. Безопасное хранение носителей информации\n" +
        "4. Ограничение доступа посторонних к рабочему месту\n" +
        "5. Правильная утилизация документов (использование шредера)"
    },
    {
      title: "Безопасность программного обеспечения",
      content: "Меры по обеспечению безопасности ПО:\n\n" +
        "1. Регулярное обновление операционной системы\n" +
        "2. Использование антивирусного ПО\n" +
        "3. Установка только проверенного ПО\n" +
        "4. Регулярное резервное копирование данных\n" +
        "5. Использование корпоративного VPN при удаленной работе"
    },
    {
      title: "Безопасность корпоративных данных",
      content: "Правила работы с корпоративной информацией:\n\n" +
        "1. Использование шифрования для конфиденциальных данных\n" +
        "2. Правильная классификация информации\n" +
        "3. Соблюдение политики доступа к данным\n" +
        "4. Осторожность при использовании съемных носителей\n" +
        "5. Запрет на передачу корпоративных данных через личные каналы связи"
    },
    {
      title: "Безопасность при удаленной работе",
      content: "Особенности безопасности при работе из дома:\n\n" +
        "1. Защищенное домашнее Wi-Fi соединение\n" +
        "2. Использование корпоративного VPN\n" +
        "3. Отдельное рабочее место\n" +
        "4. Соблюдение правил информационной безопасности как в офисе\n" +
        "5. Защита от посторонних глаз при работе с конфиденциальной информацией"
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

  return (
    <Box>
      <Header />
      <AnimatedPage path="/workplace-security"
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
                      ? "Отлично! Вы хорошо знаете правила безопасности на рабочем месте!" 
                      : score >= questions.length * 0.8 
                        ? "Хороший результат! Но есть место для улучшения."
                        : "Рекомендуем повторить материал для лучшего понимания правил безопасности."}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
      </AnimatedPage>
    </Box>
  );
};

export default WorkplaceSecurityModule; 