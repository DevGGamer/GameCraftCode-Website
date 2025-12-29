import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Trophy,
  Star,
  Zap,
  Rocket,
  Target,
  Flame,
  Medal,
  Crown,
  Heart,
  BookOpen,
  Code,
  Gamepad2,
  Lock
} from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: 'Первый шаг',
      description: 'Завершите свой первый урок',
      icon: Rocket,
      color: 'from-green-500 to-emerald-500',
      unlocked: true,
      unlockedDate: '15 января 2024',
      xp: 50,
    },
    {
      id: 2,
      title: 'Ученик кода',
      description: 'Пройдите первый модуль курса',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      unlocked: true,
      unlockedDate: '20 января 2024',
      xp: 100,
    },
    {
      id: 3,
      title: 'Программист-новичок',
      description: 'Напишите свою первую программу',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      unlocked: true,
      unlockedDate: '22 января 2024',
      xp: 150,
    },
    {
      id: 4,
      title: 'На волне успеха',
      description: 'Занимайтесь 7 дней подряд',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      unlocked: true,
      unlockedDate: '28 января 2024',
      xp: 200,
    },
    {
      id: 5,
      title: 'Создатель игр',
      description: 'Создайте свою первую игру',
      icon: Gamepad2,
      color: 'from-primary to-secondary',
      unlocked: true,
      unlockedDate: '5 февраля 2024',
      xp: 250,
    },
    {
      id: 6,
      title: 'Точный выстрел',
      description: 'Получите 100% за задание',
      icon: Target,
      color: 'from-yellow-500 to-amber-500',
      unlocked: true,
      unlockedDate: '10 февраля 2024',
      xp: 100,
    },
    {
      id: 7,
      title: 'Молния',
      description: 'Завершите урок за один день',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      unlocked: true,
      unlockedDate: '12 февраля 2024',
      xp: 75,
    },
    {
      id: 8,
      title: 'Суперзвезда',
      description: 'Получите 5 оценок "отлично" подряд',
      icon: Star,
      color: 'from-yellow-400 to-yellow-600',
      unlocked: false,
      progress: 60,
      progressText: '3/5 оценок',
      xp: 300,
    },
    {
      id: 9,
      title: 'Марафонец',
      description: 'Занимайтесь 30 дней подряд',
      icon: Medal,
      color: 'from-amber-500 to-orange-600',
      unlocked: false,
      progress: 23,
      progressText: '7/30 дней',
      xp: 500,
    },
    {
      id: 10,
      title: 'Мастер Python',
      description: 'Полностью завершите курс Python',
      icon: Crown,
      color: 'from-purple-500 to-violet-600',
      unlocked: false,
      progress: 65,
      progressText: '65% курса',
      xp: 1000,
    },
    {
      id: 11,
      title: 'Коллекционер проектов',
      description: 'Создайте 10 проектов',
      icon: Trophy,
      color: 'from-primary to-accent',
      unlocked: false,
      progress: 40,
      progressText: '4/10 проектов',
      xp: 400,
    },
    {
      id: 12,
      title: 'Добрый помощник',
      description: 'Помогите 5 одноклассникам в сообществе',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      unlocked: false,
      progress: 20,
      progressText: '1/5 помощей',
      xp: 200,
    },
  ];

  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <DashboardLayout title="Достижения">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="glow">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{unlockedCount}</div>
              <p className="text-muted-foreground text-sm">Достижений получено</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-6 text-center">
              <Star className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{totalXP}</div>
              <p className="text-muted-foreground text-sm">Очков опыта (XP)</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-6 text-center">
              <Target className="w-10 h-10 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{achievements.length - unlockedCount}</div>
              <p className="text-muted-foreground text-sm">Осталось открыть</p>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Achievements */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Полученные достижения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {achievements.filter(a => a.unlocked).map((achievement) => (
              <Card 
                key={achievement.id} 
                variant="glass" 
                className="group hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center">
                    {/* Badge Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 shadow-[0_0_30px_hsl(259_100%_59%/0.3)] group-hover:scale-110 transition-transform`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="font-bold text-foreground mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                    
                    {/* Info */}
                    <div className="flex items-center justify-between w-full">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        +{achievement.xp} XP
                      </Badge>
                      <span className="text-xs text-muted-foreground">{achievement.unlockedDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Locked Achievements */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            Заблокированные достижения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {achievements.filter(a => !a.unlocked).map((achievement) => (
              <Card 
                key={achievement.id} 
                variant="glass" 
                className="opacity-70 hover:opacity-100 transition-opacity overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center">
                    {/* Badge Icon - Locked */}
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 relative">
                      <achievement.icon className="w-8 h-8 text-muted-foreground/50" />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl backdrop-blur-sm">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="font-bold text-muted-foreground mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground/70 mb-3">{achievement.description}</p>
                    
                    {/* Progress */}
                    {achievement.progress !== undefined && (
                      <div className="w-full space-y-2">
                        <Progress value={achievement.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{achievement.progressText}</span>
                          <Badge variant="outline" className="text-muted-foreground">
                            +{achievement.xp} XP
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Achievements;