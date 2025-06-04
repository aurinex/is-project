import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateModuleProgress } from './ModuleProgress';

// Пример компонента модуля
const ModuleExample = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Идентификатор модуля
  const moduleId = 'example-module';
  
  // Массив слайдов лекции
  const lectureSlides = [
    { title: 'Введение', content: 'Содержание слайда 1...' },
    { title: 'Основные понятия', content: 'Содержание слайда 2...' },
    { title: 'Безопасность', content: 'Содержание слайда 3...' },
    // и т.д.
  ];
  
  // Массив вопросов теста
  const questions = [
    {
      question: 'Вопрос 1?',
      options: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
      correctAnswer: 1
    },
    {
      question: 'Вопрос 2?',
      options: ['Вариант A', 'Вариант B', 'Вариант C', 'Вариант D'],
      correctAnswer: 0
    },
    // и т.д.
  ];
  
  // Общее количество слайдов (лекция + тест)
  const totalSlides = lectureSlides.length + questions.length;
  
  // Начало теста после завершения лекции
  useEffect(() => {
    if (currentSlide === lectureSlides.length) {
      setQuizStarted(true);
      // Обновляем прогресс - лекция завершена (50%)
      updateModuleProgress(moduleId, 50);
    }
  }, [currentSlide]);
  
  // Функция для перехода к следующему слайду
  const handleNextSlide = () => {
    // Если это не последний слайд
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prevSlide => prevSlide + 1);
      
      // Если это слайд лекции, обновляем прогресс
      if (currentSlide < lectureSlides.length - 1) {
        // Вычисляем прогресс на основе пройденных слайдов лекции (максимум 50%)
        const lectureProgress = Math.round((currentSlide + 1) / lectureSlides.length * 50);
        updateModuleProgress(moduleId, lectureProgress);
      }
    }
  };
  
  // Функция для выбора варианта ответа на вопрос теста
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    const questionIndex = currentSlide - lectureSlides.length;
    const isCorrect = questions[questionIndex].correctAnswer === optionIndex;
    
    // Если ответ правильный, увеличиваем счет
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Переходим к следующему вопросу
    setTimeout(() => {
      setSelectedOption(null);
      
      // Если это последний вопрос, обновляем финальный прогресс
      if (currentSlide === totalSlides - 1) {
        // Вычисляем финальный прогресс:
        // 50% за лекцию + до 50% за тест в зависимости от правильных ответов
        const finalProgress = 50 + Math.round((score + (isCorrect ? 1 : 0)) / questions.length * 50);
        const allCorrect = score + (isCorrect ? 1 : 0) === questions.length;
        
        // Обновляем прогресс с флагом завершения, если все ответы правильные
        updateModuleProgress(moduleId, finalProgress, allCorrect);
        
        // Если все ответы правильные, завершаем модуль со 100% прогрессом
        if (allCorrect) {
          updateModuleProgress(moduleId, 100, true);
        }
      } else {
        handleNextSlide();
      }
    }, 1000);
  };
  
  // Функция для завершения модуля и возврата на главную страницу
  const handleFinish = () => {
    navigate('/');
  };
  
  // Отображение текущего слайда (лекция или тест)
  const renderCurrentSlide = () => {
    // Если это слайд лекции
    if (currentSlide < lectureSlides.length) {
      const slide = lectureSlides[currentSlide];
      return (
        <Box>
          <Typography variant="h5" gutterBottom>{slide.title}</Typography>
          <Typography>{slide.content}</Typography>
          
          <Button 
            variant="contained" 
            onClick={handleNextSlide}
            sx={{ mt: 3 }}
          >
            {currentSlide === lectureSlides.length - 1 ? 'Начать тест' : 'Далее'}
          </Button>
        </Box>
      );
    }
    
    // Если это вопрос теста
    const questionIndex = currentSlide - lectureSlides.length;
    const question = questions[questionIndex];
    
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Вопрос {questionIndex + 1} из {questions.length}
        </Typography>
        <Typography gutterBottom>{question.question}</Typography>
        
        <Box sx={{ mt: 2 }}>
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index ? 'contained' : 'outlined'}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
              sx={{ 
                display: 'block', 
                width: '100%', 
                mb: 1,
                bgcolor: selectedOption === index 
                  ? (index === question.correctAnswer ? 'success.main' : 'error.main')
                  : 'inherit',
                color: selectedOption === index ? 'white' : 'inherit'
              }}
            >
              {option}
            </Button>
          ))}
        </Box>
        
        {currentSlide === totalSlides - 1 && selectedOption !== null && (
          <Button 
            variant="contained" 
            onClick={handleFinish}
            sx={{ mt: 3 }}
          >
            Завершить модуль
          </Button>
        )}
      </Box>
    );
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Пример модуля обучения
      </Typography>
      
      {/* Прогресс бар */}
      <Box 
        sx={{ 
          width: '100%', 
          height: 8, 
          bgcolor: '#eee',
          borderRadius: 4,
          mb: 4,
          position: 'relative'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${(currentSlide / totalSlides) * 100}%`,
            bgcolor: 'primary.main',
            borderRadius: 4,
            transition: 'width 0.3s ease'
          }}
        />
      </Box>
      
      {/* Содержимое текущего слайда */}
      {renderCurrentSlide()}
    </Box>
  );
};

export default ModuleExample; 