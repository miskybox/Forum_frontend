import { useEffect, useState } from 'react';

/**
 * Cursor personalizado con avión retro
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;
    const throttle = 16; // ~60fps

    const updateCursor = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttle) return;
      lastTime = currentTime;

      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Agregar trail
      setTrails(prev => {
        const newTrail = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
        };
        const updated = [newTrail, ...prev].slice(0, 8); // Máximo 8 trails
        return updated;
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Cursor principal - Avión */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="cursor-plane" style={{ transform: `rotate(${Math.atan2(position.y - window.innerHeight/2, position.x - window.innerWidth/2) * 180 / Math.PI + 90}deg)` }}>
          ✈️
        </div>
      </div>

      {/* Trails del cursor */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${index * 0.05}s`,
            opacity: (8 - index) / 8,
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;

