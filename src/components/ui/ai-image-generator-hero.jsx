import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  images,
  features = [
    {
      title: 'Realistic Results',
      description: 'Realistic result photos that look professionally crafted.',
    },
    {
      title: 'Fast Generation',
      description: 'Turn ideas into images in seconds.',
    },
    {
      title: 'Diverse Styles',
      description: 'Choose from a wide range of artistic options.',
    },
  ],
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotatingCards, setRotatingCards] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((value) => (value + 0.5) % 360));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)));
  }, [images]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#004AAD]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#004AAD]/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full max-w-6xl h-96 sm:h-[500px] mb-12 sm:mb-16"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center perspective">
            {images.map((image, index) => {
              const angle = ((rotatingCards[index] || 0) * Math.PI) / 180;
              const radius = 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const perspectiveX = (mousePosition.x - 0.5) * 20;
              const perspectiveY = (mousePosition.y - 0.5) * 20;

              return (
                <div
                  key={image.id}
                  className="absolute w-32 h-40 sm:w-40 sm:h-48 transition-all duration-300"
                  style={{
                    transform: `translate(${x}px, ${y}px) rotateX(${perspectiveY}deg) rotateY(${perspectiveX}deg) rotateZ(${image.rotation}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className={cn(
                      'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-110 cursor-pointer group',
                    )}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <img
                      src={image.src || '/placeholder.png'}
                      alt={image.alt}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-4 leading-tight">
            {title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-8">{description}</p>

          <button
            type="button"
            onClick={onCtaClick}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-3 rounded-full',
              'bg-[#004AAD] text-white font-medium',
              'hover:shadow-lg hover:scale-105 transition-all duration-300',
              'active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2',
            )}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="relative z-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'text-center p-6 rounded-xl',
                'bg-white/90 backdrop-blur-sm border border-slate-200',
                'hover:bg-slate-100 transition-all duration-300',
              )}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
