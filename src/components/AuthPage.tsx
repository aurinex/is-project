import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        // Проверка на существующий email
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate('/');
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            alert('Этот email уже зарегистрирован. Войдите в систему.');
            setIsLogin(true);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Ошибка:', error.message);
      alert(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="login">
      <AnimatePresence mode="wait">
        <motion.h2 
          key={isLogin ? 'login' : 'register'}
          className='login-title'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? 'Вход' : 'Регистрация'}
        </motion.h2>
      </AnimatePresence>
      
      <motion.form 
        onSubmit={handleAuth}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className='login-input'
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          className='login-input'
        />
        <button type="submit" className='login-button'>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isLogin ? (
          <motion.span 
            style={{ fontFamily: 'Montserrat', fontSize: '1vw', fontWeight: '500' }}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Нет аккаунта? <motion.span
              whileHover={{ scale: 1.05, color: 'rgb(0, 83, 92)' }}
              style={{ color: 'rgb(0, 63, 72)', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '1vw', fontWeight: '500' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              Зарегистрируйтесь
            </motion.span>
          </motion.span>
        ) : (
          <motion.span 
            style={{ fontFamily: 'Montserrat', fontSize: '1vw', fontWeight: '500' }}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Есть аккаунт? <motion.span
              whileHover={{ scale: 1.05, color: 'rgb(0, 83, 92)' }}
              style={{ color: 'rgb(0, 63, 72)', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '1vw', fontWeight: '500' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              Войдите
            </motion.span>
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}