import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  BookOpen, 
  Clock, 
  Calendar,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  Video,
  FileText,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CurrentCourse = () => {
  const { courseId } = useParams();
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  // Mock course data
  const course = {
    id: courseId,
    title: 'Python для начинающих',
    description: 'Этот курс познакомит вас с основами программирования на Python — одном из самых популярных языков в мире. Вы научитесь писать простые программы, работать с переменными, условиями, циклами и функциями. К концу курса вы создадите несколько увлекательных проектов!',
    instructor: {
      name: 'Анна Петрова',
      avatar: null,
      title: 'Senior Python Developer',
    },
    duration: '3 месяца',
    startDate: '15 января 2024',
    totalLessons: 24,
    completedLessons: 16,
    progress: 65,
  };

  const modules = [
    {
      id: 1,
      title: 'Введение в Python',
      lessons: 4,
      completed: 4,
      status: 'completed',
      items: [
        { id: 1, title: 'Что такое Python?', type: 'video', duration: '15 мин', completed: true },
        { id: 2, title: 'Установка Python', type: 'video', duration: '10 мин', completed: true },
        { id: 3, title: 'Первая программа', type: 'video', duration: '20 мин', completed: true },
        { id: 4, title: 'Практика: Hello World', type: 'task', completed: true },
      ],
    },
    {
      id: 2,
      title: 'Переменные и типы данных',
      lessons: 5,
      completed: 5,
      status: 'completed',
      items: [
        { id: 5, title: 'Что такое переменные?', type: 'video', duration: '18 мин', completed: true },
        { id: 6, title: 'Числа и строки', type: 'video', duration: '22 мин', completed: true },
        { id: 7, title: 'Списки и словари', type: 'video', duration: '25 мин', completed: true },
        { id: 8, title: 'Преобразование типов', type: 'video', duration: '15 мин', completed: true },
        { id: 9, title: 'Практика: Калькулятор', type: 'task', completed: true },
      ],
    },
    {
      id: 3,
      title: 'Условия и циклы',
      lessons: 6,
      completed: 4,
      status: 'in-progress',
      items: [
        { id: 10, title: 'Условный оператор if', type: 'video', duration: '20 мин', completed: true },
        { id: 11, title: 'Операторы сравнения', type: 'video', duration: '15 мин', completed: true },
        { id: 12, title: 'Цикл for', type: 'video', duration: '25 мин', completed: true },
        { id: 13, title: 'Цикл while', type: 'video', duration: '20 мин', completed: true },
        { id: 14, title: 'Вложенные циклы', type: 'video', duration: '22 мин', completed: false },
        { id: 15, title: 'Практика: Угадай число', type: 'task', completed: false },
      ],
    },
    {
      id: 4,
      title: 'Функции',
      lessons: 5,
      completed: 3,
      status: 'in-progress',
      items: [
        { id: 16, title: 'Создание функций', type: 'video', duration: '20 мин', completed: true },
        { id: 17, title: 'Параметры и аргументы', type: 'video', duration: '18 мин', completed: true },
        { id: 18, title: 'Возвращаемые значения', type: 'video', duration: '15 мин', completed: true },
        { id: 19, title: 'Область видимости', type: 'video', duration: '20 мин', completed: false },
        { id: 20, title: 'Практика: Мини-игра', type: 'task', completed: false },
      ],
    },
    {
      id: 5,
      title: 'Работа с файлами',
      lessons: 4,
      completed: 0,
      status: 'locked',
      items: [
        { id: 21, title: 'Чтение файлов', type: 'video', duration: '18 мин', completed: false },
        { id: 22, title: 'Запись в файлы', type: 'video', duration: '15 мин', completed: false },
        { id: 23, title: 'Работа с JSON', type: 'video', duration: '22 мин', completed: false },
        { id: 24, title: 'Финальный проект', type: 'task', completed: false },
      ],
    },
  ];

  const assignments = [
    { id: 1, title: 'Практика: Hello World', module: 'Введение в Python', status: 'completed', grade: '100%' },
    { id: 2, title: 'Практика: Калькулятор', module: 'Переменные и типы данных', status: 'completed', grade: '95%' },
    { id: 3, title: 'Практика: Угадай число', module: 'Условия и циклы', status: 'pending', grade: null },
    { id: 4, title: 'Практика: Мини-игра', module: 'Функции', status: 'pending', grade: null },
    { id: 5, title: 'Финальный проект', module: 'Работа с файлами', status: 'locked', grade: null },
  ];

  const recordings = [
    { id: 1, title: 'Урок 1: Введение в Python', date: '15 января 2024', duration: '1:30:00' },
    { id: 2, title: 'Урок 2: Переменные', date: '17 января 2024', duration: '1:25:00' },
    { id: 3, title: 'Урок 3: Типы данных', date: '20 января 2024', duration: '1:35:00' },
    { id: 4, title: 'Урок 4: Условия', date: '22 января 2024', duration: '1:28:00' },
    { id: 5, title: 'Урок 5: Циклы', date: '24 января 2024', duration: '1:40:00' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-primary" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout showBack title={course.title}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card variant="glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">Прогресс курса</h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {course.completedLessons}/{course.totalLessons} уроков
                </Badge>
              </div>
              <Progress value={course.progress} className="h-4 mb-2" />
              <p className="text-sm text-muted-foreground">
                До завершения осталось {course.totalLessons - course.completedLessons} уроков
              </p>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="font-display">Модули курса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {modules.map((module) => (
                <div 
                  key={module.id} 
                  className={`rounded-xl border transition-all ${
                    module.status === 'locked' 
                      ? 'border-border/30 bg-card/30 opacity-60' 
                      : 'border-border/50 bg-card/50 hover:border-primary/30'
                  }`}
                >
                  <button
                    className="w-full p-4 flex items-center justify-between text-left"
                    onClick={() => module.status !== 'locked' && setExpandedModule(expandedModule === module.id ? null : module.id)}
                    disabled={module.status === 'locked'}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(module.status)}
                      <div>
                        <h3 className="font-bold text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {module.completed}/{module.lessons} уроков завершено
                        </p>
                      </div>
                    </div>
                    {module.status !== 'locked' && (
                      expandedModule === module.id 
                        ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedModule === module.id && module.status !== 'locked' && (
                    <div className="px-4 pb-4 space-y-2">
                      {module.items.map((item) => (
                        <div 
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            item.completed ? 'bg-green-500/10' : 'bg-card/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.type === 'video' ? (
                              <Video className="w-4 h-4 text-secondary" />
                            ) : (
                              <FileText className="w-4 h-4 text-primary" />
                            )}
                            <span className={item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.duration && (
                              <span className="text-xs text-muted-foreground">{item.duration}</span>
                            )}
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <Play className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="assignments" className="w-full">
            <TabsList className="w-full justify-start bg-card/50 p-1">
              <TabsTrigger value="assignments" className="flex-1 sm:flex-none">Задания</TabsTrigger>
              <TabsTrigger value="recordings" className="flex-1 sm:flex-none">Записи занятий</TabsTrigger>
              <TabsTrigger value="description" className="flex-1 sm:flex-none">Описание курса</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-4 space-y-3">
                  {assignments.map((assignment) => (
                    <div 
                      key={assignment.id}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        assignment.status === 'locked' 
                          ? 'border-border/30 bg-card/30 opacity-60' 
                          : 'border-border/50 bg-card/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {assignment.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : assignment.status === 'locked' ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Circle className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <h4 className="font-medium text-foreground">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.module}</p>
                        </div>
                      </div>
                      {assignment.grade ? (
                        <Badge className="bg-green-500/20 text-green-400">{assignment.grade}</Badge>
                      ) : assignment.status !== 'locked' ? (
                        <Button size="sm" variant="outline">Выполнить</Button>
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recordings" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-4 space-y-3">
                  {recordings.map((recording) => (
                    <div 
                      key={recording.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <Video className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{recording.title}</h4>
                          <p className="text-sm text-muted-foreground">{recording.date} • {recording.duration}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4 mr-1" />
                        Смотреть
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-foreground leading-relaxed">{course.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="font-display text-base">Преподаватель</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  {course.instructor.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-primary-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{course.instructor.name}</h4>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="font-display text-base">Информация о курсе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Длительность</p>
                  <p className="font-medium text-foreground">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Дата начала</p>
                  <p className="font-medium text-foreground">{course.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Всего уроков</p>
                  <p className="font-medium text-foreground">{course.totalLessons} уроков</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button variant="cosmic" size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Продолжить обучение
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CurrentCourse;
