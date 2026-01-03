import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
  Flame,
  Wallet,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

type DashboardData = {
  user: {
    name: string;
    avatar: string | null;
    role: "admin" | "teacher" | "student" | "parent";
  };
  stats: {
    coins: number;
    balance: number;
    streak: number;
    level: number;
    achievements: number;
  };
};

const host_name = "http://localhost:8000";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${host_name}/api/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Ошибка загрузки dashboard");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center text-muted-foreground">Загрузка...</div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500">
          Не удалось загрузить данные
        </div>
      </DashboardLayout>
    );
  }

  const { user, stats } = data;

  const currentCourse = {
    id: 1,
    title: "Python для начинающих",
    progress: 65,
  };

  const dashboardCards = [
    {
      path: "/dashboard/courses",
      label: "Мои курсы",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      path: "/dashboard/progress",
      label: "Прогресс обучения",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      path: "/dashboard/schedule",
      label: "Расписание",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
    {
      path: "/dashboard/projects",
      label: "Мои проекты",
      icon: FolderOpen,
      color: "from-orange-500 to-yellow-500",
    },
    {
      path: "/dashboard/achievements",
      label: "Достижения",
      icon: Trophy,
      color: "from-yellow-500 to-amber-500",
    },
    {
      path: "/dashboard/community",
      label: "Сообщество",
      icon: Users,
      color: "from-primary to-secondary",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <Card variant="glow">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary-foreground" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center border-4 border-card">
                  <span className="font-bold text-sm text-black">
                    {stats.level}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Привет, {user.name}! 👋
                </h1>

                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">{stats.coins}</span>
                    <span className="text-sm text-muted-foreground">монет</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">{stats.streak}</span>
                    <span className="text-sm text-muted-foreground">
                      дней подряд
                    </span>
                  </div>

                  <RouterLink
                    to="/dashboard/achievements"
                    className="flex items-center gap-2"
                  >
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-bold">{stats.achievements}</span>
                    <span className="text-sm text-muted-foreground">
                      достижений
                    </span>
                  </RouterLink>
                </div>

                {/* Balance Display - Only for Students */}
                {user.role === "student" && (
                  <RouterLink
                    to="/dashboard/balance"
                    className="inline-flex w-fit items-center gap-2 mt-4 md:mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
                  >
                    <Wallet className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-foreground">
                      {stats.balance.toLocaleString("ru-RU")} ₽
                    </span>
                    <span className="text-muted-foreground text-sm">
                      баланс
                    </span>
                  </RouterLink>
                )}
              </div>

              <Link to="/dashboard/profile">
                <Button variant="outline">Редактировать профиль</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Current Course */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Текущий курс</h2>
            </div>

            <h3 className="text-xl font-bold mb-2">{currentCourse.title}</h3>

            <div className="flex items-center gap-3">
              <Progress value={currentCourse.progress} className="flex-1 h-3" />
              <span className="font-bold text-primary">
                {currentCourse.progress}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {dashboardCards.map((card) => (
            <Link key={card.path} to={card.path}>
              <Card
                variant="glass"
                className="h-full hover:scale-105 transition"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-bold">{card.label}</span>
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
