import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Попытка выхода...');
      if (!auth) {
        console.error('Auth не инициализирован');
        return;
      }
      await signOut(auth);
      navigate('/auth');
      console.log('Выход выполнен успешно');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header style={{
      width: '75vw',
      height: '5vw',
      backgroundColor: '#dedede',
      margin: '0 auto',
      marginTop: '1.5vw',
      borderRadius: '2vw',
      boxShadow: '0 0 1vw 0 rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5vw',
    }}>
      <Link to="/basic-security" className="header-btn">Основы ИБ</Link>
      <Link to="/password-security" className="header-btn">Безопасность паролей</Link>
      <Link to="/phishing" className="header-btn">Фишинг</Link>
      <Link to="/workplace-security" className="header-btn">Безопасность рабочего места</Link>
      <button 
        className="header-btn" 
        onClick={handleLogout}
        style={{ left: '80%' }}
      >
        Выйти
      </button>
    </header>
  );
} 