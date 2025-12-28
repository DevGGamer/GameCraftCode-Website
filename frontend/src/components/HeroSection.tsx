import { Button } from '@/components/ui/button';
import StarField from '@/components/StarField';
import heroImage from '@/assets/hero-space.png';
import { Sparkles, Play } from 'lucide-react';

const HeroSection = () => {
  const scrollToEnrollment = () => {
    const element = document.querySelector('#enrollment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Stars overlay */}
      <StarField count={80} />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-[hsl(258,100%,59%)] animate-float opacity-60 blur-[2px]" />
      <div className="absolute top-1/3 right-20 w-6 h-6 rounded-full bg-[hsl(220,100%,75%)] animate-float-delayed opacity-50 blur-[2px]" />
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-[hsl(270,60%,82%)] animate-float opacity-40 blur-[1px]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-accent mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Онлайн-школа программирования и творчества</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">Открой вселенную</span>
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              программирования
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Превращаем сложное программирование в увлекательное космическое приключение. 
            Создай свою первую игру уже на пробном уроке!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="cosmic" 
              size="xl"
              onClick={scrollToEnrollment}
              className="w-full sm:w-auto group"
            >
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              Записаться на обучение
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-4 h-4" />
              Смотреть программы
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '1500+', label: 'учеников' },
              { value: '50+', label: 'курсов' },
              { value: '95%', label: 'довольных' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
