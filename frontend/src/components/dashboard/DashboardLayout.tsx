import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StarField from "@/components/StarField";
import {
  Rocket,
  BookOpen,
  TrendingUp,
  Calendar,
  FolderOpen,
  Users,
  LogOut,
  User,
  Trophy,
  Coins,
  ChevronLeft,
  Shield,
  GraduationCap,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

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

const navItems = [
  {
    path: "/dashboard/courses",
    label: "Мои курсы",
    icon: BookOpen,
    roles: ["student", "parent", "teacher", "admin"],
  },
  {
    path: "/dashboard/progress",
    label: "Прогресс обучения",
    icon: TrendingUp,
    roles: ["student", "parent", "admin"],
  },
  {
    path: "/dashboard/schedule",
    label: "Расписание",
    icon: Calendar,
    roles: ["student", "parent", "teacher", "admin"],
  },
  {
    path: "/dashboard/projects",
    label: "Мои проекты",
    icon: FolderOpen,
    roles: ["student", "parent", "admin"],
  },
  {
    path: "/dashboard/achievements",
    label: "Достижения",
    icon: Trophy,
    roles: ["student", "parent", "admin"],
  },
  {
    path: "/dashboard/community",
    label: "Сообщество",
    icon: Users,
    roles: ["student", "parent", "teacher", "admin"],
  },
  {
    path: "/dashboard/admin",
    label: "Админ панель",
    icon: Shield,
    roles: ["admin"],
  },
  {
    path: "/dashboard/methodologist",
    label: "Панель методиста",
    icon: GraduationCap,
    roles: ["admin"],
  },
];

const DashboardLayout = ({
  children,
  title,
  showBack = false,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);

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
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return;

  // Mock student data
  const { user, stats } = data;

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-hero-gradient" />
      <StarField count={80} />

      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[200px]" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[150px]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border/30 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(259_100%_59%/0.4)]">
                  <Rocket className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent hidden sm:inline">
                  PixelVerse
                </span>
              </Link>

              {/* Student Info */}
              <div className="flex items-center gap-4">
                {/* Coins */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-sm text-foreground">
                    {stats.coins}
                  </span>
                </div>

                {/* Profile */}
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <span className="font-medium text-sm text-foreground hidden sm:inline">
                    {user.name}
                  </span>
                </Link>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Выйти</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-border/30 bg-card/20 backdrop-blur-md overflow-x-auto">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-2">
              {filteredNavItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {(showBack || title) && (
            <div className="flex items-center gap-4 mb-6">
              {showBack && (
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Назад
                </Button>
              )}
              {title && (
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {title}
                </h1>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
