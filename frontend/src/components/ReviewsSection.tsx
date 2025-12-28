import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Анна Петрова',
    role: 'Мама Миши, 11 лет',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Миша занимается уже полгода и результаты поразительные! Сам создал игру для одноклассников. Спасибо преподавателям за терпение и индивидуальный подход.',
  },
  {
    name: 'Дмитрий Козлов',
    role: 'Папа Алисы, 14 лет',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Дочь хотела создавать сайты, и здесь она это делает! Уже сделала портфолио и ведёт свой блог. Очень рады, что нашли PixelVerse.',
  },
  {
    name: 'Екатерина Смирнова',
    role: 'Мама Артёма, 9 лет',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Артём просто обожает занятия! Каждый урок рассказывает, что нового узнал. Игровой формат идеально подходит для его возраста.',
  },
  {
    name: 'Максим, 13 лет',
    role: 'Ученик',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Раньше думал, что программирование — это скучно. Но здесь я создаю настоящие игры! Уже мечтаю стать геймдизайнером.',
  },
  {
    name: 'Ольга Новикова',
    role: 'Мама Даши, 12 лет',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Отличная школа! Удобный график, понятные объяснения, интересные проекты. Даша стала более усидчивой и внимательной.',
  },
  {
    name: 'София, 15 лет',
    role: 'Ученица',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Здесь я поняла, что хочу связать жизнь с IT. Преподаватели реально крутые и всегда помогают, даже с самыми сложными вопросами!',
  },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Отзывы </span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              родителей и учеников
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Истории успеха наших студентов и благодарности от родителей
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={review.name}
              variant="glass"
              className="group hover:-translate-y-2 transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                {/* Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  «{review.text}»
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
