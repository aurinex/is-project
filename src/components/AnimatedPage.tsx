import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

interface AnimatedPageProps {
  children: React.ReactNode;
  path: string;
  sx?: any;
}

export default function AnimatedPage({ children, path }: AnimatedPageProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsActive(location.pathname === path);
  }, [location.pathname, path]);

  useEffect(() => {
    if (isActive && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isActive]);

  return (
    <div
      className="page-container"
      style={{
        opacity: isActive ? 1 : 0,
        height: `600px`,
        overflow: 'hidden',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
} 