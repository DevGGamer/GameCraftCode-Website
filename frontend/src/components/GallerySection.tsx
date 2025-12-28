import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star } from 'lucide-react';

const projects = [
  {
    title: 'Космический рейсер',
    author: 'Артём, 12 лет',
    course: 'Unity',
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
    description: 'Аркадная гонка на космических кораблях с препятствиями и бустерами',
    skills: ['C#', 'Unity', '3D'],
  },
  {
    title: 'Платформер "Пиксель"',
    author: 'София, 10 лет',
    course: 'Scratch',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    description: 'Красочный платформер с уникальными уровнями и персонажами',
    skills: ['Scratch', 'Анимация', 'Логика'],
  },
  {
    title: 'Портфолио-сайт',
    author: 'Максим, 14 лет',
    course: 'Веб-разработка',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    description: 'Современный персональный сайт с галереей работ и анимациями',
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Чат-бот помощник',
    author: 'Алиса, 15 лет',
    course: 'Python',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    description: 'Умный бот для Telegram с интеграцией ИИ для ответов на вопросы',
    skills: ['Python', 'API', 'AI'],
  },
  {
    title: 'Мобильный трекер',
    author: 'Даниил, 16 лет',
    course: 'Мобильная разработка',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    description: 'Приложение для отслеживания целей и привычек с геймификацией',
    skills: ['React Native', 'UI/UX', 'Firebase'],
  },
  {
    title: 'RPG в Roblox',
    author: 'Егор, 11 лет',
    course: 'Roblox Studio',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    description: 'Полноценная ролевая игра с квестами, NPC и системой прокачки',
    skills: ['Lua', 'Roblox', 'Геймдизайн'],
  },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="text-foreground">Проекты </span>
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              учеников
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Реальные работы наших студентов. Каждый проект — это результат 
            творчества, упорства и новых знаний
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card 
              key={project.title}
              variant="glass"
              className="group overflow-hidden hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <Badge className="absolute top-4 right-4 bg-primary/90">
                  {project.course}
                </Badge>
              </div>
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-muted-foreground">{project.author}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
