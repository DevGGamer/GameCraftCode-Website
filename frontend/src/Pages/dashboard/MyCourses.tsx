import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BookOpen, Clock, Star, Play, Loader2 } from 'lucide-react';
import { useState, useEffect } from "react";
import api from "@/api";

const COURSE_COLORS = [
  'from-green-500 to-emerald-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-yellow-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-violet-500',
];

const MyCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/user_course/")
      .then((response) => {
        const cours = response.data.map((item: any, index: number) => ({
          id: index,
          name: item.name,
          title: item.title,
          description: item.description,
          progress: item.progress,
          totalLessons: item.totalLessons,
          completedLessons: item.completedLessons,
          duration: item.duration,
          level: item.level,
          isActive: item.isActive,
          startDate: item.startDate,
          color: COURSE_COLORS[index % COURSE_COLORS.length],
          instructor: item.instructor,
          modules: item.modules,
        }));
        setCourses(cours);
      })
      .catch((error) => {
        console.error("Failed to load courses:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Мои курсы">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (courses.length === 0) {
    return (
      <DashboardLayout title="Мои курсы">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold mb-2">У вас пока нет курсов</h3>
          <p className="text-muted-foreground mb-6">Запишитесь на курс, чтобы начать обучение</p>
        </div>
      </DashboardLayout>
    );
  }

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
                <Link to={`/dashboard/courses/${course.name}`} state={{ course }}>
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
