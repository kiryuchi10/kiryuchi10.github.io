import { useEffect, useRef } from 'react';

const NODES = 40;
const LINE_DISTANCE = 80;
const MOUSE_INFLUENCE = 1.0;

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouse = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    nodesRef.current = Array.from({ length: NODES }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = !document.documentElement.classList.contains('light');
      ctx.strokeStyle = isDark ? 'rgba(60, 180, 255, 0.11)' : 'rgba(40,60,80,0.4)';

      const nodes = nodesRef.current;
      nodes.forEach((n) => {
        if (mouse.current.x != null && mouse.current.y != null) {
          const dx = mouse.current.x - n.x;
          const dy = mouse.current.y - n.y;
          n.vx += dx * MOUSE_INFLUENCE * 0.001;
          n.vy += dy * MOUSE_INFLUENCE * 0.001;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.98;
        n.vy *= 0.98;
        if (n.x < 0) n.x += canvas.width;
        if (n.x > canvas.width) n.x -= canvas.width;
        if (n.y < 0) n.y += canvas.height;
        if (n.y > canvas.height) n.y -= canvas.height;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DISTANCE) {
            ctx.globalAlpha = 1 - dist / LINE_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(80,220,255,0.18)' : 'rgba(70,120,180,0.6)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" aria-hidden="true" />;
};

export default AnimatedBackground;
