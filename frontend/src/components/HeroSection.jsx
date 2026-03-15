import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const SLIDES = [
  '/slideshow/1.webp',
  '/slideshow/3.webp',
  '/slideshow/5.webp',
  '/slideshow/6.webp',
  '/slideshow/7.webp',
  '/slideshow/2.webp',
  '/slideshow/4.png',
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
  };

  const resetAutoPlay = () => {
    clearInterval(intervalRef.current);
    startAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    resetAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    resetAutoPlay();
  };

  useEffect(() => {
    setIsVisible(true);
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="relative w-screen h-screen flex items-center pt-28 md:pt-32 lg:pt-24 pb-8 overflow-hidden bg-bg text-primary">
      {/* Abstract Background Shapes */}
      <div className={`absolute top-1/4 right-10 w-32 h-32 bg-highlight-yellow border-3 border-primary rounded-full shadow-neo animate-float hidden lg:block transition-all duration-1000 ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-12 opacity-0'}`}></div>
      <div className={`absolute bottom-20 left-10 w-24 h-24 bg-highlight-purple border-3 border-primary shadow-neo hidden lg:block transition-all duration-1000 delay-200 ${isVisible ? 'transform translate-y-0 rotate-12 opacity-100' : 'transform translate-y-12 rotate-12 opacity-0'}`}></div>
      <div className={`absolute top-2/3 left-1/4 w-16 h-16 bg-highlight-teal border-3 border-primary rounded-none shadow-neo hidden lg:block animate-float animation-delay-200 transition-all duration-1000 delay-500 ${isVisible ? 'transform scale-100 opacity-100' : 'transform scale-0 opacity-0'}`}></div>

      <div className={`w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-white border-2 border-primary shadow-neo-sm transform -rotate-1 mb-4 md:mb-6">
              <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                Collaborative Innovation & Development
              </span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-5 uppercase tracking-tighter leading-[0.85]">
              <span className="block mb-1 sm:mb-2">Bridging</span>
              <span className="bg-highlight-yellow px-4 py-0.5 border-3 border-primary transform -skew-x-6 inline-block mb-1 sm:mb-2 text-primary">ACADEMICS</span> <br />
              <span className="block mt-1 sm:mt-2">WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gray-800">INDUSTRY</span></span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-5 md:mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-primary pl-4 md:pl-6">
              A structured platform for hands-on learning, real-world projects, and innovation-driven growth in the Department of CSE.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/contact" className="btn-neo text-xs md:text-sm py-2 px-4 md:py-2.5 md:px-5 flex items-center gap-2 shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Join CID Now <ArrowRight size={18} className="border-l-2 border-primary pl-2" />
              </Link>
              <Link to="/projects" className="btn-neo-secondary text-xs md:text-sm py-2 px-4 md:py-2.5 md:px-5 shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Explore Projects
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-5 md:mt-6 flex items-center justify-center lg:justify-start gap-6 md:gap-8">
              {[
                { count: '50+', label: 'Projects', color: 'bg-highlight-pink' },
                { count: '20+', label: 'Events', color: 'bg-highlight-yellow' },
                { count: '100+', label: 'Members', color: 'bg-highlight-teal' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="block font-heading text-xl sm:text-2xl font-black">{stat.count}</span>
                  <span className={`${stat.color} px-2 py-0.5 text-[8px] sm:text-[10px] font-bold border border-primary uppercase block mt-0.5`}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Image */}
          <div className="flex-[1.3] relative w-full max-w-lg lg:max-w-none">
            <div className="relative bg-white border-4 border-primary rounded-neo shadow-neo-lg p-1.5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black">
                {/* Slides */}
                {SLIDES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Slide ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}

                {/* Prev Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-primary shadow-neo-sm rounded-full p-1.5 hover:bg-highlight-yellow transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-primary shadow-neo-sm rounded-full p-1.5 hover:bg-highlight-yellow transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentSlide(i); resetAutoPlay(); }}
                      className={`w-2 h-2 rounded-full border border-primary transition-all ${i === currentSlide ? 'bg-highlight-yellow w-5' : 'bg-white'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Background decoration behind image */}
            <div className="absolute -z-10 top-6 -right-4 w-full h-full bg-primary rounded-neo"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
