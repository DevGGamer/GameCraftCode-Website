import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FolderOpen, ExternalLink, Code, Gamepad2, Globe, Sparkles } from 'lucide-react';

const MyProjects = () => {
  const projects = [
    {
      id: 1,
      title: 'Космический шутер',
      description: 'Игра на Scratch с управлением космическим кораблём и уничтожением астероидов',
      type: 'game',
      course: 'Создание игр в Scratch',
      status: 'completed',
      progress: 100,
      image: null,
      skills: ['Scratch', 'Анимация', 'Логика'],
    },
    {
      id: 2,
      title: 'Калькулятор на Python',
      description: 'Консольный калькулятор с поддержкой всех базовых операций',
      type: 'code',
      course: 'Python для начинающих',
      status: 'completed',
      progress: 100,
      image: null,
      skills: ['Python', 'Функции', 'Условия'],
    },
    {
      id: 3,
      title: 'Игра "Угадай число"',
      description: 'Интерактивная игра с подсказками и счётом попыток',
      type: 'code',
      course: 'Python для начинающих',
      status: 'in-progress',
      progress: 60,
      image: null,
      skills: ['Python', 'Циклы', 'Random'],
    },
    {
      id: 4,
      title: 'Личный сайт',
      description: 'Многостраничный сайт-портфолио с галереей проектов',
      type: 'web',
      course: 'Веб-разработка: HTML & CSS',
      status: 'in-progress',
      progress: 30,
      image: null,
      skills: ['HTML', 'CSS', 'Flexbox'],
    },
    {
      id: 5,
      title: 'Платформер',
      description: 'Игра-платформер с уровнями и системой очков',
      type: 'game',
      course: 'Создание игр в Scratch',
      status: 'completed',
      progress: 100,
      image: null,
      skills: ['Scratch', 'Физика', 'Уровни'],
    },
    {
      id: 6,
      title: 'Чат-бот',
      description: 'Простой чат-бот с ответами на вопросы',
      type: 'code',
      course: 'Python для начинающих',
      status: 'planned',
      progress: 0,
      image: null,
      skills: ['Python', 'Строки', 'Условия'],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'game':
        return <Gamepad2 className="w-5 h-5" />;
      case 'web':
        return <Globe className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'game':
        return 'from-orange-500 to-yellow-500';
      case 'web':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Завершён</Badge>;
      case 'in-progress':
        return <Badge className="bg-primary/20 text-primary border-primary/30">В процессе</Badge>;
      default:
        return <Badge className="bg-muted/50 text-muted-foreground border-border/50">Запланирован</Badge>;
    }
  };

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in-progress').length;

  return (
    <DashboardLayout title="Мои проекты">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedProjects}</p>
              <p className="text-sm text-muted-foreground">Завершено</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inProgressProjects}</p>
              <p className="text-sm text-muted-foreground">В процессе</p>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Всего проектов</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            variant="glass" 
            className={`overflow-hidden group hover:border-primary/30 transition-all ${
              project.status === 'planned' ? 'opacity-60' : ''
            }`}
          >
            <CardContent className="p-0">
              {/* Project Header */}
              <div className={`h-32 bg-gradient-to-br ${getTypeColor(project.type)} flex items-center justify-center relative`}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {getTypeIcon(project.type)}
                </div>
                {project.status === 'completed' && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/20 text-white backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      100%
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Status */}
                <div className="flex items-center justify-between mb-3">
                  {getStatusBadge(project.status)}
                </div>

                {/* Title & Description */}
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Course */}
                <p className="text-xs text-muted-foreground mb-4">
                  Курс: {project.course}
                </p>

                {/* Progress */}
                {project.status !== 'planned' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span className="font-bold text-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                )}

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Action */}
                {project.status === 'completed' ? (
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Открыть проект
                  </Button>
                ) : project.status === 'in-progress' ? (
                  <Button variant="cosmic" className="w-full">
                    Продолжить
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full" disabled>
                    Скоро
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyProjects;
