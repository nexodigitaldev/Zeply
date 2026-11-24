import { useState, useEffect, useRef } from 'react';

// Hook para detectar posición de scroll y activar estados dinámicos del Navbar
export function useScrollPosition(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollY(currentY);
          setIsScrolled(currentY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificar estado inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { isScrolled, scrollY };
}

// Hook de detección de visibilidad en viewport con IntersectionObserver
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }) {
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        // Una vez visible, desconectamos si queremos animación one-shot
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, inView];
}

// Hook para animación fluida de números que suben al aparecer en pantalla
export function useAnimatedCounter(endValue, duration = 2000, startNow = true, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startNow) return;

    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing cúbico hacia afuera para desaceleración natural y elegante
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeOutProgress * endValue;

      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [endValue, duration, startNow, decimals]);

  return count;
}

// Hook para efecto 3D Parallax Tilt al pasar el cursor sobre tarjetas interactivas
export function use3DTilt(maxTilt = 8) {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out',
      });
    };

    const handleMouseLeave = () => {
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);

  return [ref, style];
}
