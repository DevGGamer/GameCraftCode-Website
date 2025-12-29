import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarField from '@/components/StarField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  CheckCircle2, 
  BookOpen,
  Gamepad2,
  Code,
  Globe,
  Palette,
  Smartphone,
  Cpu,
  Target,
  Rocket,
  Award,
  User
} from 'lucide-react';

// Course data matching ProgramsSection
const coursesData: Record<string, {
  icon: React.ElementType;
  title: string;
  age: string;
  level: string;
  description: string;
  skills: string[];
  color: string;
  duration: string;
  lessonsPerWeek: number;
  totalStudents: number;
  rating: number;
  importance: string;
  modules: { title: string; lessons: number; outcomes: string[] }[];
  skillsGained: { category: string; items: string[] }[];
  projects: { title: string; description: string; image: string }[];
  instructors: { name: string; role: string; experience: string }[];
}> = {
  'game-creation': {
    icon: Gamepad2,
    title: 'Создание игр',
    age: '8-10 лет',
    level: 'Начинающий',
    description: 'Первые шаги в программировании через создание простых игр в Scratch и Roblox Studio',
    skills: ['Scratch', 'Roblox Studio', 'Логика'],
    color: 'from-pink-500 to-rose-500',
    duration: '4 месяца',
    lessonsPerWeek: 2,
    totalStudents: 340,
    rating: 4.9,
    importance: 'Создание игр — идеальный способ познакомить ребёнка с программированием! Через игровой процесс дети естественным образом осваивают логическое мышление, учатся решать задачи и развивают креативность. Scratch и Roblox Studio делают обучение увлекательным приключением, где каждый проект — это маленькая победа.',
    modules: [
      { title: 'Знакомство со Scratch', lessons: 8, outcomes: ['Понимание интерфейса Scratch', 'Создание первых анимаций', 'Работа со спрайтами'] },
      { title: 'Создание простых игр', lessons: 10, outcomes: ['Игровая логика', 'Управление персонажем', 'Подсчёт очков'] },
      { title: 'Основы Roblox Studio', lessons: 8, outcomes: ['3D-окружение', 'Скрипты на Lua', 'Публикация игр'] },
      { title: 'Финальный проект', lessons: 6, outcomes: ['Самостоятельная разработка', 'Презентация проекта', 'Работа в команде'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Программирование в Scratch', 'Основы Lua', 'Работа с 3D-объектами', 'Создание анимаций'] },
      { category: 'Soft skills', items: ['Логическое мышление', 'Креативность', 'Решение задач', 'Работа в команде'] },
    ],
    projects: [
      { title: 'Космический шутер', description: 'Аркадная игра с управлением космическим кораблём', image: '/placeholder.svg' },
      { title: 'Платформер "Приключение"', description: 'Игра с прыжками и сбором монет', image: '/placeholder.svg' },
      { title: 'Мир в Roblox', description: '3D-игровой мир с квестами', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Михаил Козлов', role: 'Game Developer', experience: '5 лет опыта в разработке игр' },
      { name: 'Елена Смирнова', role: 'Педагог-методист', experience: '8 лет работы с детьми' },
    ],
  },
  'python-kids': {
    icon: Code,
    title: 'Python для детей',
    age: '10-13 лет',
    level: 'Начинающий',
    description: 'Изучение основ Python через создание интересных проектов и мини-игр',
    skills: ['Python', 'Алгоритмы', 'Pygame'],
    color: 'from-yellow-500 to-orange-500',
    duration: '5 месяцев',
    lessonsPerWeek: 2,
    totalStudents: 520,
    rating: 4.8,
    importance: 'Python — один из самых востребованных языков программирования в мире. Изучение Python в раннем возрасте закладывает прочный фундамент для будущей карьеры в IT. Дети учатся писать настоящий код, создавать игры и приложения, развивая аналитическое мышление и навыки решения сложных задач.',
    modules: [
      { title: 'Основы Python', lessons: 10, outcomes: ['Синтаксис Python', 'Переменные и типы данных', 'Условия и циклы'] },
      { title: 'Функции и структуры данных', lessons: 10, outcomes: ['Создание функций', 'Списки и словари', 'Работа с файлами'] },
      { title: 'Pygame: создание игр', lessons: 12, outcomes: ['Графика и спрайты', 'Обработка событий', 'Игровой цикл'] },
      { title: 'Финальный проект', lessons: 8, outcomes: ['Разработка полноценной игры', 'Отладка кода', 'Документация'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Программирование на Python', 'Алгоритмическое мышление', 'Разработка игр с Pygame', 'Работа с данными'] },
      { category: 'Soft skills', items: ['Критическое мышление', 'Внимание к деталям', 'Самостоятельность', 'Упорство'] },
    ],
    projects: [
      { title: 'Калькулятор', description: 'Программа для математических вычислений', image: '/placeholder.svg' },
      { title: 'Змейка', description: 'Классическая игра на Python', image: '/placeholder.svg' },
      { title: 'Викторина', description: 'Интерактивная игра с вопросами', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Анна Петрова', role: 'Senior Python Developer', experience: '7 лет опыта разработки' },
      { name: 'Дмитрий Волков', role: 'Data Scientist', experience: '5 лет работы с Python' },
    ],
  },
  'web-development': {
    icon: Globe,
    title: 'Веб-разработка',
    age: '11-14 лет',
    level: 'Средний',
    description: 'Создание собственных сайтов и веб-приложений с нуля',
    skills: ['HTML', 'CSS', 'JavaScript'],
    color: 'from-blue-500 to-cyan-500',
    duration: '6 месяцев',
    lessonsPerWeek: 2,
    totalStudents: 410,
    rating: 4.9,
    importance: 'Веб-разработка открывает безграничные возможности для творчества и самовыражения. Умение создавать сайты — это не только востребованный навык на рынке труда, но и возможность воплотить любые идеи в жизнь. Дети учатся создавать красивые и функциональные веб-страницы, понимая, как работает интернет.',
    modules: [
      { title: 'HTML: структура страниц', lessons: 8, outcomes: ['Теги и атрибуты', 'Семантическая вёрстка', 'Формы и таблицы'] },
      { title: 'CSS: стилизация', lessons: 10, outcomes: ['Селекторы и свойства', 'Flexbox и Grid', 'Анимации'] },
      { title: 'JavaScript: интерактивность', lessons: 14, outcomes: ['Переменные и функции', 'События и DOM', 'Работа с API'] },
      { title: 'Финальный проект', lessons: 8, outcomes: ['Полноценный сайт', 'Адаптивный дизайн', 'Публикация в интернете'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['HTML5 и CSS3', 'JavaScript ES6+', 'Адаптивная вёрстка', 'Git и GitHub'] },
      { category: 'Soft skills', items: ['Дизайн-мышление', 'Внимание к деталям', 'Проектное мышление', 'Коммуникация'] },
    ],
    projects: [
      { title: 'Личный блог', description: 'Многостраничный сайт с постами', image: '/placeholder.svg' },
      { title: 'Интернет-магазин', description: 'Каталог товаров с корзиной', image: '/placeholder.svg' },
      { title: 'Интерактивная игра', description: 'Браузерная игра на JavaScript', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Сергей Иванов', role: 'Frontend Developer', experience: '6 лет в веб-разработке' },
      { name: 'Мария Николаева', role: 'UX/UI Designer', experience: '4 года опыта дизайна' },
    ],
  },
  'game-design': {
    icon: Palette,
    title: 'Геймдизайн',
    age: '12-15 лет',
    level: 'Средний',
    description: 'Разработка полноценных игр с использованием Unity и C#',
    skills: ['Unity', 'C#', '3D-моделирование'],
    color: 'from-purple-500 to-violet-500',
    duration: '8 месяцев',
    lessonsPerWeek: 2,
    totalStudents: 280,
    rating: 4.7,
    importance: 'Unity — профессиональный игровой движок, используемый в индустрии. Изучение геймдизайна развивает системное мышление, креативность и технические навыки на профессиональном уровне. Дети создают 2D и 3D игры, осваивая настоящие инструменты разработчиков.',
    modules: [
      { title: 'Основы Unity', lessons: 12, outcomes: ['Интерфейс Unity', 'Компоненты и объекты', 'Физика в играх'] },
      { title: 'Программирование на C#', lessons: 14, outcomes: ['Синтаксис C#', 'ООП основы', 'Скрипты в Unity'] },
      { title: '2D игры', lessons: 10, outcomes: ['Спрайты и анимации', 'Tilemaps', 'Платформеры'] },
      { title: '3D игры и финальный проект', lessons: 12, outcomes: ['3D-моделирование', 'Освещение и материалы', 'Публикация игры'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Unity Engine', 'C# программирование', '3D-моделирование', 'Игровой дизайн'] },
      { category: 'Soft skills', items: ['Системное мышление', 'Проектный менеджмент', 'Творческое решение задач', 'Презентация идей'] },
    ],
    projects: [
      { title: 'Раннер', description: 'Бесконечная 2D игра с препятствиями', image: '/placeholder.svg' },
      { title: 'Шутер от первого лица', description: '3D игра с механикой стрельбы', image: '/placeholder.svg' },
      { title: 'Головоломка', description: 'Логическая игра с уровнями', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Алексей Морозов', role: 'Unity Developer', experience: '8 лет в gamedev' },
      { name: 'Ольга Кузнецова', role: '3D Artist', experience: '6 лет в игровой индустрии' },
    ],
  },
  'mobile-apps': {
    icon: Smartphone,
    title: 'Мобильные приложения',
    age: '13-16 лет',
    level: 'Продвинутый',
    description: 'Создание приложений для Android и iOS с использованием современных технологий',
    skills: ['React Native', 'Flutter', 'UI/UX'],
    color: 'from-green-500 to-emerald-500',
    duration: '7 месяцев',
    lessonsPerWeek: 2,
    totalStudents: 195,
    rating: 4.8,
    importance: 'Мобильные приложения окружают нас повсюду. Умение создавать их — это возможность превратить любую идею в реальный продукт, которым будут пользоваться люди. Курс готовит к карьере мобильного разработчика, одной из самых востребованных профессий в IT.',
    modules: [
      { title: 'Основы мобильной разработки', lessons: 8, outcomes: ['Архитектура приложений', 'UI компоненты', 'Навигация'] },
      { title: 'React Native', lessons: 14, outcomes: ['JSX и компоненты', 'State и Props', 'Работа с API'] },
      { title: 'Flutter (обзор)', lessons: 8, outcomes: ['Dart основы', 'Widgets', 'Кроссплатформенность'] },
      { title: 'Финальный проект', lessons: 10, outcomes: ['Полноценное приложение', 'Публикация в Store', 'Тестирование'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['React Native', 'Dart/Flutter', 'UI/UX дизайн', 'REST API'] },
      { category: 'Soft skills', items: ['Продуктовое мышление', 'UX исследования', 'Работа с требованиями', 'Тестирование'] },
    ],
    projects: [
      { title: 'To-Do приложение', description: 'Менеджер задач с уведомлениями', image: '/placeholder.svg' },
      { title: 'Погодное приложение', description: 'Прогноз погоды с API', image: '/placeholder.svg' },
      { title: 'Социальная сеть', description: 'Приложение с авторизацией и постами', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Павел Сидоров', role: 'Mobile Developer', experience: '5 лет мобильной разработки' },
      { name: 'Ирина Белова', role: 'Product Designer', experience: '4 года в продуктовом дизайне' },
    ],
  },
  'artificial-intelligence': {
    icon: Cpu,
    title: 'Искусственный интеллект',
    age: '14-17 лет',
    level: 'Продвинутый',
    description: 'Погружение в мир машинного обучения и нейронных сетей',
    skills: ['Python', 'TensorFlow', 'Data Science'],
    color: 'from-primary to-secondary',
    duration: '9 месяцев',
    lessonsPerWeek: 2,
    totalStudents: 150,
    rating: 4.9,
    importance: 'Искусственный интеллект меняет мир прямо сейчас. Понимание принципов машинного обучения и работы с данными — это билет в будущее технологий. Курс открывает двери в одну из самых перспективных и высокооплачиваемых областей IT.',
    modules: [
      { title: 'Python для Data Science', lessons: 12, outcomes: ['NumPy и Pandas', 'Визуализация данных', 'Статистика'] },
      { title: 'Машинное обучение', lessons: 14, outcomes: ['Алгоритмы ML', 'Классификация и регрессия', 'Оценка моделей'] },
      { title: 'Нейронные сети', lessons: 12, outcomes: ['Архитектура сетей', 'TensorFlow/Keras', 'Обучение моделей'] },
      { title: 'Проекты с AI', lessons: 10, outcomes: ['Computer Vision', 'NLP основы', 'Практические применения'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Python для ML', 'TensorFlow/Keras', 'Анализ данных', 'Нейронные сети'] },
      { category: 'Soft skills', items: ['Аналитическое мышление', 'Научный подход', 'Работа с неопределённостью', 'Исследовательские навыки'] },
    ],
    projects: [
      { title: 'Распознавание изображений', description: 'Классификация картинок с помощью CNN', image: '/placeholder.svg' },
      { title: 'Чат-бот', description: 'Интеллектуальный помощник на NLP', image: '/placeholder.svg' },
      { title: 'Предсказание данных', description: 'Модель для прогнозирования', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Виктор Романов', role: 'ML Engineer', experience: '7 лет в AI/ML' },
      { name: 'Наталья Орлова', role: 'Data Scientist', experience: '5 лет анализа данных' },
    ],
  },
};

const CourseDetail = () => {
  const { courseSlug } = useParams();
  const course = coursesData[courseSlug || ''];

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Курс не найден</h1>
          <Link to="/#programs">
            <Button>Вернуться к курсам</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const IconComponent = course.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StarField />
      
      <main className="relative z-10 pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative">
            <Link to="/#programs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Назад к курсам
            </Link>
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="ml-2 text-sm text-accent font-medium">{course.age}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {course.title}
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-foreground">{course.totalStudents} учеников</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-foreground">{course.rating}/5</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {course.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <Link to="/#enrollment">
                  <Button size="lg" variant="cosmic" className="text-lg px-8">
                    <Rocket className="w-5 h-5 mr-2" />
                    Записаться на курс
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Importance Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card variant="glow" className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-4">Почему этот курс важен?</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{course.importance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Программа курса
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {course.modules.map((module, index) => (
                <Card key={index} variant="glass" className="hover:-translate-y-1 transition-transform">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.lessons} уроков</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium text-foreground mb-2">Результаты обучения:</h4>
                    <ul className="space-y-2">
                      {module.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-12 bg-muted/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Навыки после курса
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {course.skillsGained.map((category, index) => (
                <Card key={index} variant="cosmic">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-sm py-1.5 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Проекты курса
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {course.projects.map((project, index) => (
                <Card key={index} variant="glass" className="overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Rocket className="w-12 h-12 text-primary/50 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors Section */}
        <section className="py-12 bg-muted/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Преподаватели
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {course.instructors.map((instructor, index) => (
                <Card key={index} variant="glass">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{instructor.name}</h3>
                      <p className="text-primary font-medium">{instructor.role}</p>
                      <p className="text-sm text-muted-foreground">{instructor.experience}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card variant="glow" className="p-8 md:p-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                Готовы начать обучение?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к {course.totalStudents}+ ученикам, которые уже изучают {course.title.toLowerCase()} в PixelVerse!
              </p>
              <Link to="/#enrollment">
                <Button size="lg" variant="cosmic" className="text-lg px-10">
                  <Rocket className="w-5 h-5 mr-2" />
                  Записаться на курс
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
