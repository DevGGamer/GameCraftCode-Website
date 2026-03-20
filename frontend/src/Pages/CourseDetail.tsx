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
  Gamepad2,
  Code,
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
  'python-kids': {
    icon: Code,
    title: 'Программирование на Python',
    age: '10–16 лет',
    level: 'С нуля',
    description: 'От первой программы до собственной игры: 20 занятий, на которых ученик пройдёт путь от вывода «Hello World» до полноценной аркады на Pygame и GUI-приложений с tkinter',
    skills: ['Python', 'Tkinter', 'Pygame', 'API'],
    color: 'from-yellow-500 to-orange-500',
    duration: '20 занятий (60–90 мин)',
    lessonsPerWeek: 1,
    totalStudents: 520,
    rating: 4.8,
    importance: 'Python — один из самых востребованных языков программирования в мире. На этом курсе дети пишут настоящий код с первого занятия: создают текстовые квесты, GUI-калькуляторы, погодные приложения через API и полноценные игры. Каждый урок — законченный мини-проект, который можно показать друзьям. К концу курса ученик создаёт и защищает собственную игру или приложение.',
    modules: [
      { title: 'Основы Python', lessons: 5, outcomes: ['Переменные, ввод и вывод', 'Условия и ветвление', 'Циклы while и for', 'Списки и работа с ними', 'Текстовый квест и игра «Угадай число»'] },
      { title: 'Углубление и структуры данных', lessons: 3, outcomes: ['Функции и декомпозиция кода', 'Словари и кортежи', 'Работа с файлами и обработка ошибок'] },
      { title: 'GUI-приложения с tkinter', lessons: 4, outcomes: ['Окна, кнопки, поля ввода', 'Калькулятор с интерфейсом', 'Менеджер задач «Мой планировщик»', 'Работа с API: «Погодная станция»'] },
      { title: 'Игры с Pygame', lessons: 6, outcomes: ['Игровой цикл, фигуры и спрайты', 'Движение, управление, столкновения', 'Классы и ООП в контексте игр', 'Стрельба, враги и волны', 'Полноценная аркада «Космический стрелок»'] },
      { title: 'Финальный проект', lessons: 2, outcomes: ['Проектирование и разработка своей игры/приложения', 'Презентация и защита проекта'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Программирование на Python', 'GUI-разработка (tkinter)', 'Создание игр (Pygame)', 'Работа с API и интернетом', 'Основы ООП', 'Работа с файлами и данными'] },
      { category: 'Soft skills', items: ['Алгоритмическое мышление', 'Декомпозиция задач', 'Отладка и поиск ошибок', 'Самостоятельная разработка', 'Презентация проекта'] },
    ],
    projects: [
      { title: 'Текстовый квест «Пещера дракона»', description: 'Игра с ветвящимся сюжетом на условиях и циклах', image: '/placeholder.svg' },
      { title: 'Погодная станция', description: 'GUI-приложение с данными из API в реальном времени', image: '/placeholder.svg' },
      { title: '«Космический стрелок»', description: 'Полноценная аркада на Pygame с волнами врагов, звуком и меню', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Анна Петрова', role: 'Senior Python Developer', experience: '7 лет опыта разработки' },
      { name: 'Дмитрий Волков', role: 'Преподаватель программирования', experience: '5 лет работы с детьми' },
    ],
  },
  'unity-gamedev': {
    icon: Gamepad2,
    title: 'Разработка игр на Unity',
    age: '10–16 лет',
    level: 'С нуля',
    description: 'Изучаем C# и Unity с нуля: 23 занятия от первого «Hello World» в консоли до полноценной 3D-игры с препятствиями, бонусами, UI и сохранением прогресса',
    skills: ['C#', 'Unity', '3D Gamedev', 'ООП'],
    color: 'from-purple-500 to-violet-500',
    duration: '23 занятия + бонус (60–90 мин)',
    lessonsPerWeek: 1,
    totalStudents: 280,
    rating: 4.7,
    importance: 'Unity — профессиональный игровой движок, на котором создаются тысячи игр для ПК, консолей и мобильных устройств. На этом курсе дети сначала глубоко осваивают язык C# (переменные, условия, циклы, углублённое ООП, коллекции, игровая математика — 8 занятий), а затем применяют знания в Unity 3D: создают модели и материалы, проектируют модульные уровни, настраивают анимации через Mecanim, добавляют препятствия, ловушки, бонусы, систему здоровья и полноценное меню. Финальный результат — собранная .exe-игра и её защита перед группой.',
    modules: [
      { title: 'Основы C#', lessons: 7, outcomes: ['Переменные, типы данных, консольный ввод/вывод', 'Условия и логические операторы', 'Циклы и массивы', 'Методы и функции', 'Основы ООП: классы, объекты, свойства', 'Углублённое ООП: наследование, полиморфизм, инкапсуляция', 'Коллекции и перечисления: List, Dictionary, enum'] },
      { title: 'Знакомство с Unity', lessons: 4, outcomes: ['Интерфейс Unity, GameObject 3D, компоненты', 'Первый скрипт: MonoBehaviour, движение в 3D', 'Ввод игрока и 3D-физика: Rigidbody, коллизии', 'Игровая математика: векторы, координаты, углы'] },
      { title: 'Визуал и дизайн уровней', lessons: 4, outcomes: ['3D-модели, материалы и текстуры', 'Модульный дизайн 3D-уровней', 'Эффекты частиц, 3D-камера и пост-обработка', 'Анимации: Animator и Mecanim'] },
      { title: 'Геймплей и механики', lessons: 4, outcomes: ['Здоровье, урон и система жизней', 'Препятствия и ловушки', 'Предметы, бонусы и коллекционные предметы', 'Звуки, музыка и AudioManager'] },
      { title: 'Завершение игры', lessons: 4, outcomes: ['UI: счёт, HP-бар, экраны', 'Меню, Game Over, пауза, управление сценами', 'Сохранение прогресса, несколько уровней, сборка .exe', 'Финальный проект — презентация и защита'] },
    ],
    skillsGained: [
      { category: 'Технические навыки', items: ['Программирование на C#', 'Unity Engine (3D)', 'Физика и коллизии', '3D-модели и материалы', 'Анимации и Mecanim', 'Пост-обработка и визуальные эффекты', 'UI/UX интерфейс игры', 'Игровая математика', 'Сборка и публикация'] },
      { category: 'Soft skills', items: ['Системное мышление', 'Декомпозиция сложных задач', 'Отладка и тестирование', 'Работа с версиями (Git)', 'Презентация проекта'] },
    ],
    projects: [
      { title: '3D-игра с модульными уровнями', description: 'Трёхмерный мир с моделями, материалами, текстурами и физикой', image: '/placeholder.svg' },
      { title: 'Система препятствий и ловушек', description: 'Ловушки, бонусы, система здоровья и звуковое оформление', image: '/placeholder.svg' },
      { title: 'Полноценная игра (.exe)', description: 'Собранная 3D-игра с меню, уровнями, сохранением и UI', image: '/placeholder.svg' },
    ],
    instructors: [
      { name: 'Алексей Морозов', role: 'Unity Developer', experience: '8 лет в gamedev' },
      { name: 'Ольга Кузнецова', role: 'Преподаватель программирования', experience: '6 лет работы с детьми' },
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
