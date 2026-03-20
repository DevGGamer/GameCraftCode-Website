import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  const handlePlayVideo = (lessonId: number, lesson: any) => {
    navigate(`/dashboard/courses/${courseId}/lesson/${lessonId}`, { state: { lesson }} );
  };

  const handleDoAssignment = (assignmentId: number) => {
    navigate(`/dashboard/courses/${courseId}/assignment/${assignmentId}`);
  };

  const { state } = useLocation();

  // Извлекаем задания из модулей (items с type === 'task')
  const assignments = useMemo(() => {
    if (!state?.course?.modules) return [];
    return state.course.modules.flatMap((module: any) =>
      (module.items || [])
        .filter((item: any) => item.type === 'task')
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          module: module.title,
          status: module.status === 'locked' ? 'locked' : item.completed ? 'completed' : 'pending',
          grade: null,
        }))
    );
  }, [state?.course?.modules]);

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
    <DashboardLayout showBack title={state.course.title}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card variant="glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">Прогресс курса</h2>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {state.course.completedLessons}/{state.course.totalLessons} уроков
                </Badge>
              </div>
              <Progress value={state.course.progress} className="h-4 mb-2" />
              <p className="text-sm text-muted-foreground">
                До завершения осталось {state.course.totalLessons - state.course.completedLessons} уроков
              </p>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="font-display">Модули курса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.course.modules.map((module: any) => (
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
                      {module.items.map((item: any) => (
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
                            ) : item.type === 'video' ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => handlePlayVideo(item.id, item)}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2"
                                onClick={() => handleDoAssignment(item.id)}
                              >
                                <FileText className="w-3 h-3" />
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
                  {assignments.length > 0 ? (
                    assignments.map((assignment: any) => (
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/dashboard/courses/${courseId}/assignment/${assignment.id}/feedback`)}
                          >
                            <Badge className="bg-green-500/20 text-green-400">{assignment.grade}</Badge>
                          </Button>
                        ) : assignment.status !== 'locked' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDoAssignment(assignment.id)}
                          >
                            Выполнить
                          </Button>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
                      <p className="text-muted-foreground">Заданий пока нет</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recordings" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Video className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">Записи занятий пока недоступны</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-foreground leading-relaxed">{state.course.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor */}
          {state.course.instructor && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display text-base">Преподаватель</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    {state.course.instructor.avatar ? (
                      <img src={state.course.instructor.avatar} alt={state.course.instructor.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{state.course.instructor.name}</h4>
                    <p className="text-sm text-muted-foreground">{state.course.instructor.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <p className="font-medium text-foreground">{state.course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Дата начала</p>
                  <p className="font-medium text-foreground">{state.course.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Всего уроков</p>
                  <p className="font-medium text-foreground">{state.course.totalLessons} уроков</p>
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
