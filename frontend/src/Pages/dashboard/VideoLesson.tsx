import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Clock, 
  CheckCircle2,
  BookOpen,
  Download
} from 'lucide-react';

const VideoLesson = () => {
  const { courseId, lessonId } = useParams();
  const { state } = useLocation();
  console.log(state)

  // Mock lesson data
  const lesson = {
    id: lessonId,
    title: 'Что такое Python?',
    description: 'В этом уроке вы познакомитесь с языком программирования Python. Мы рассмотрим историю создания языка, его преимущества и области применения. Вы узнаете, почему Python считается одним из лучших языков для начинающих программистов.',
    duration: '15 минут',
    module: 'Введение в Python',
    completed: false,
    videoUrl: 'https://example.com/video',
    nextLesson: { id: 2, title: 'Установка Python' },
    prevLesson: null,
    resources: [
      { title: 'Конспект урока', type: 'pdf' },
      { title: 'Дополнительные материалы', type: 'link' },
    ],
  };

  return (
    <DashboardLayout showBack title={lesson.title}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Video Player */}
        <Card variant="glow" className="overflow-hidden">
          <video width="100%" height="auto" controls src={state.lesson.video}>
          </video>
        </Card>

        {/* Lesson Info */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">{lesson.module}</Badge>
                    <h1 className="text-2xl font-display font-bold text-foreground">{lesson.title}</h1>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{lesson.duration}</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {lesson.prevLesson ? (
                <Link to={`/dashboard/courses/${courseId}/lesson/${lesson.prevLesson.id}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="truncate">{lesson.prevLesson.title}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              
              {lesson.nextLesson && (
                <Link to={`/dashboard/courses/${courseId}/lesson/${lesson.nextLesson.id}`} className="flex-1">
                  <Button variant="cosmic" className="w-full justify-end">
                    <span className="truncate">{lesson.nextLesson.title}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Статус урока
                </h3>
                <Button 
                  variant={lesson.completed ? "outline" : "cosmic"} 
                  className="w-full"
                >
                  {lesson.completed ? 'Урок завершён' : 'Отметить как завершённый'}
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Материалы урока
                </h3>
                <div className="space-y-2">
                  {lesson.resources.map((resource, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors text-left"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{resource.title}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoLesson;
