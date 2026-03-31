import { useEffect, useRef, useState } from 'react';

export default function SectionHeading({ subtitle, title, description, light = false, compact = false, alignLeft = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef}
      className={`${alignLeft ? 'text-left' : 'text-center mx-auto'} max-w-3xl ${compact ? 'mb-10 md:mb-12' : 'mb-20 md:mb-24'} relative transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Decorative center glow */}
      <div className={`absolute -top-10 ${alignLeft ? 'left-6' : 'left-1/2 -translate-x-1/2'} w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10 pointer-events-none`}></div>
      
      {subtitle && (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full border border-white/10 shadow-glass text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest ${compact ? 'mb-4' : 'mb-6'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow-purple"></span>
          {subtitle}
        </span>
      )}
      <h2 className={`font-heading ${compact ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8'} font-black uppercase tracking-tight leading-[1] text-white drop-shadow-md`}>
        {title}
      </h2>
      {description && (
        <p className={`${compact ? 'text-sm md:text-base' : 'text-base md:text-lg'} font-medium max-w-2xl mx-auto leading-relaxed text-slate-300`}>
          {description}
        </p>
      )}
    </div>
  );
}
