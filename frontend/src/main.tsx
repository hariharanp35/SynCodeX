import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import './readability.css';

const particles = Array.from({ length: 18 }, (_, index) => index);
const codeSymbols = ['</>', '{ }', '01', 'AI', '=>', '[ ]', '0101'];

function AnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;

    if (!background || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let frame = 0;
    const moveLight = (event: PointerEvent) => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const x = event.clientX;
        const y = event.clientY;
        const offsetX = (x / window.innerWidth - 0.5) * 34;
        const offsetY = (y / window.innerHeight - 0.5) * 26;
        background.style.setProperty('--pointer-x', `${x}px`);
        background.style.setProperty('--pointer-y', `${y}px`);
        background.style.setProperty('--parallax-x', `${offsetX}px`);
        background.style.setProperty('--parallax-y', `${offsetY}px`);
      });
    };

    const resetLight = () => {
      background.style.setProperty('--pointer-x', '50%');
      background.style.setProperty('--pointer-y', '45%');
      background.style.setProperty('--parallax-x', '0px');
      background.style.setProperty('--parallax-y', '0px');
    };

    window.addEventListener('pointermove', moveLight, { passive: true });
    window.addEventListener('pointerleave', resetLight);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('pointermove', moveLight);
      window.removeEventListener('pointerleave', resetLight);
    };
  }, []);

  return (
    <div className="animated-backdrop" ref={backgroundRef} aria-hidden="true">
      <div className="backdrop-waves" />
      <div className="backdrop-grid" />
      <div className="backdrop-streaks" />
      <svg className="energy-network" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path className="energy-path energy-path-one" d="M-80 590 C180 380 300 820 560 580 S940 280 1120 490 S1320 690 1520 420" />
        <path className="energy-path energy-path-two" d="M-100 270 C150 460 330 180 540 360 S880 680 1080 430 S1320 220 1540 360" />
        <circle className="energy-node node-one" cx="560" cy="580" r="4" />
        <circle className="energy-node node-two" cx="1120" cy="490" r="4" />
        <circle className="energy-node node-three" cx="540" cy="360" r="3" />
        <circle className="energy-node node-four" cx="1080" cy="430" r="3" />
      </svg>
      <div className="particle-field">
        {particles.map((particle) => (
          <span className="particle" key={particle} />
        ))}
      </div>
      <div className="symbol-field">
        {codeSymbols.map((symbol, index) => (
          <span className="code-symbol" key={`${symbol}-${index}`}>
            {symbol}
          </span>
        ))}
      </div>
      <div className="pointer-glow" />
    </div>
  );
}

function ScrollReveal() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.app-shell main > section, .app-shell footer'),
    );

    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );

    sections.forEach((section) => {
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove('scroll-reveal', 'is-visible');
      });
    };
  }, []);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimatedBackground />
    <ScrollReveal />
    <App />
  </React.StrictMode>,
);
