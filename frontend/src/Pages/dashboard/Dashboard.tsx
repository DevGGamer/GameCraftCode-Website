import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  FolderOpen, 
  Users, 
  User,
  Coins,
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  // Mock student data
  const student = {
    name: 'Алексей',
    avatar: null,
    currentCourse: 'Python для начинающих',
    currentCourseProgress: 65,
    coins: 1250,
    streak: 7,
    level: 5,
    achievements: 12,
  };

  const dashboardCards = [
    { path: '/dashboard/courses', label: 'Мои курсы', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
    { path: '/dashboard/progress', label: 'Прогресс обучения', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { path: '/dashboard/schedule', label: 'Расписание', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { path: '/dashboard/projects', label: 'Мои проекты', icon: FolderOpen, color: 'from-orange-500 to-yellow-500' },
    { path: '/dashboard/achievements', label: 'Достижения', icon: Trophy, color: 'from-yellow-500 to-amber-500' },
    { path: '/dashboard/community', label: 'Сообщество', icon: Users, color: 'from-primary to-secondary' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card variant="glow" className="overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_hsl(259_100%_59%/0.4)]">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center border-4 border-card">
                  <span className="font-bold text-sm text-black">{student.level}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  Привет, {student.name}! 👋
                </h1>
                <p className="text-muted-foreground mb-4">
                  Продолжай обучение и покоряй новые вершины!
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold text-foreground">{student.coins}</span>
                    <span className="text-muted-foreground text-sm">монет</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-foreground">{student.streak}</span>
                    <span className="text-muted-foreground text-sm">дней подряд</span>
                  </div>
                  <RouterLink to="/dashboard/achievements" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-bold text-foreground">{student.achievements}</span>
                    <span className="text-muted-foreground text-sm">достижений</span>
                  </RouterLink>
                </div>
              </div>

              {/* Edit Profile */}
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm">
                  Редактировать профиль
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Current Course */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-foreground">Текущий курс</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-foreground mb-2">{student.currentCourse}</h3>
                <div className="flex items-center gap-3">
                  <Progress value={student.currentCourseProgress} className="flex-1 h-3" />
                  <span className="font-bold text-primary">{student.currentCourseProgress}%</span>
                </div>
              </div>
              <Link to="/dashboard/courses/1">
                <Button variant="cosmic">
                  Продолжить
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {dashboardCards.map((card) => (
            <Link key={card.path} to={card.path}>
              <Card variant="glass" className="h-full group hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:shadow-[0_0_30px_hsl(259_100%_59%/0.4)] transition-shadow`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-bold text-foreground">{card.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
