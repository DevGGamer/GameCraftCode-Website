import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BookOpen, Clock, Star, Play } from 'lucide-react';

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Python для начинающих',
      description: 'Изучите основы программирования на Python',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      duration: '3 месяца',
      level: 'Начинающий',
      isActive: true,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 2,
      title: 'Создание игр в Scratch',
      description: 'Создавайте увлекательные игры без кода',
      progress: 100,
      totalLessons: 16,
      completedLessons: 16,
      duration: '2 месяца',
      level: 'Начинающий',
      isActive: false,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      id: 3,
      title: 'Веб-разработка: HTML & CSS',
      description: 'Создайте свой первый сайт',
      progress: 30,
      totalLessons: 20,
      completedLessons: 6,
      duration: '2.5 месяца',
      level: 'Начинающий',
      isActive: false,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 4,
      title: 'JavaScript: Интерактивные сайты',
      description: 'Оживите свои веб-страницы',
      progress: 0,
      totalLessons: 28,
      completedLessons: 0,
      duration: '4 месяца',
      level: 'Средний',
      isActive: false,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <DashboardLayout title="Мои курсы">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            variant={course.isActive ? 'glow' : 'glass'} 
            className={`overflow-hidden ${course.isActive ? 'ring-2 ring-primary/50' : ''}`}
          >
            <CardContent className="p-0">
              {/* Course Header */}
              <div className={`h-3 bg-gradient-to-r ${course.color}`} />
              
              <div className="p-6">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {course.isActive && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Активный курс
                    </Badge>
                  )}
                  {course.progress === 100 && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Завершён
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-muted-foreground">
                    {course.level}
                  </Badge>
                </div>

                {/* Title & Description */}
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.completedLessons}/{course.totalLessons} уроков</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-bold text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* Action */}
                <Link to={`/dashboard/courses/${course.id}`}>
                  <Button 
                    variant={course.isActive ? 'cosmic' : 'outline'} 
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {course.progress === 0 ? 'Начать курс' : course.progress === 100 ? 'Повторить' : 'Продолжить'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
