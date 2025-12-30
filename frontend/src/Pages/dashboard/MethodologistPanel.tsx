import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  BookOpen,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseData {
  id: string;
  name: string;
  ageRange: string;
  icon: string;
  color: string;
  isImportant: boolean;
  modulesCount: number;
  lessonsCount: number;
  studentsCount: number;
}

const initialCourses: CourseData[] = [
  {
    id: '1',
    name: 'Python для начинающих',
    ageRange: '10-14 лет',
    icon: '🐍',
    color: 'from-green-500 to-emerald-600',
    isImportant: true,
    modulesCount: 8,
    lessonsCount: 32,
    studentsCount: 45,
  },
  {
    id: '2',
    name: 'Создание игр на Scratch',
    ageRange: '8-10 лет',
    icon: '🎮',
    color: 'from-orange-500 to-amber-600',
    isImportant: true,
    modulesCount: 6,
    lessonsCount: 24,
    studentsCount: 62,
  },
  {
    id: '3',
    name: 'Веб-разработка',
    ageRange: '12-16 лет',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-600',
    isImportant: false,
    modulesCount: 10,
    lessonsCount: 40,
    studentsCount: 38,
  },
  {
    id: '4',
    name: 'Разработка мобильных приложений',
    ageRange: '14-17 лет',
    icon: '📱',
    color: 'from-purple-500 to-pink-600',
    isImportant: false,
    modulesCount: 12,
    lessonsCount: 48,
    studentsCount: 28,
  },
  {
    id: '5',
    name: 'Робототехника и Arduino',
    ageRange: '10-14 лет',
    icon: '🤖',
    color: 'from-red-500 to-rose-600',
    isImportant: true,
    modulesCount: 8,
    lessonsCount: 32,
    studentsCount: 35,
  },
];

const MethodologistPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseData[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    setCourses(courses.filter(course => course.id !== selectedCourse.id));
    setIsDeleteDialogOpen(false);
    setSelectedCourse(null);
    toast({
      title: 'Курс удалён',
      description: `«${selectedCourse.name}» удалён из системы`,
      variant: 'destructive',
    });
  };

  const openDeleteDialog = (course: CourseData) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Панель методиста">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск курсов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate('/dashboard/course-builder/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить курс
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Course Header */}
              <div className={`h-24 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}>
                <span className="text-5xl">{course.icon}</span>
                {course.isImportant && (
                  <div className="absolute top-3 right-3 bg-yellow-500/90 text-yellow-950 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Ключевой
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{course.ageRange}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <BookOpen className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-bold text-foreground">{course.modulesCount}</p>
                    <p className="text-xs text-muted-foreground">Модулей</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-secondary" />
                    <p className="text-sm font-bold text-foreground">{course.lessonsCount}</p>
                    <p className="text-xs text-muted-foreground">Уроков</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Users className="w-4 h-4 mx-auto mb-1 text-accent" />
                    <p className="text-sm font-bold text-foreground">{course.studentsCount}</p>
                    <p className="text-xs text-muted-foreground">Учеников</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/dashboard/course-builder/${course.id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => openDeleteDialog(course)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Курсы не найдены</h3>
            <p className="text-muted-foreground mb-4">
              Попробуйте изменить параметры поиска или добавьте новый курс
            </p>
            <Button onClick={() => navigate('/dashboard/course-builder/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить курс
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Удалить курс?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить курс «{selectedCourse?.name}»? 
              Это действие нельзя отменить. Все связанные модули и уроки будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MethodologistPanel;
