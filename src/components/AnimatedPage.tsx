import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, SxProps, Theme } from '@mui/material';
import '../App.css';

interface AnimatedPageProps {
  children: ReactNode;
  path: string;
  sx?: SxProps<Theme>;
}

const AnimatedPage = ({ children, path, sx }: AnimatedPageProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Декоративные элементы для фона
  const decorations = [
    { 
      type: 'circle', 
      size: '300px', 
      color: 'rgba(76, 201, 240, 0.3)', 
      top: '10%', 
      left: '-5%',
      animation: 'float',
      duration: 15
    },
    { 
      type: 'blob', 
      size: '250px', 
      color: 'rgba(67, 97, 238, 0.2)', 
      top: '60%', 
      right: '-8%',
      animation: 'float',
      duration: 20
    },
    { 
      type: 'circle', 
      size: '150px', 
      color: 'rgba(58, 12, 163, 0.15)', 
      bottom: '5%', 
      left: '10%',
      animation: 'pulse',
      duration: 8
    },
    { 
      type: 'blob', 
      size: '100px', 
      color: 'rgba(76, 201, 240, 0.15)', 
      top: '20%', 
      right: '15%',
      animation: 'pulse',
      duration: 12
    }
  ];

  return (
    <Box sx={{ position: 'relative', mt: '4vw' }}>
      {/* Декоративные элементы */}
      {decorations.map((item, index) => (
        <Box
          key={index}
          component={motion.div}
          sx={{
            position: 'fixed',
            width: item.size,
            height: item.size,
            borderRadius: item.type === 'circle' ? '50%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
            background: item.color,
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            zIndex: -1,
            filter: 'blur(40px)',
          }}
          animate={{
            y: item.animation === 'float' ? [0, -20, 0] : 0,
            scale: item.animation === 'pulse' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Основной контент с анимацией */}
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.5
        }}
      >
        <Box 
          className="glass-card"
          sx={{
            maxWidth: '75vw',
            mx: 'auto',
            p: '2vw',
            minHeight: '34vw',
            position: 'relative',
            ...sx
          }}
        >
          {children}
        </Box>
      </motion.div>
    </Box>
  );
};

export default AnimatedPage; 