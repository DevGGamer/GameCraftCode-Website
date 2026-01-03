import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Camera, Calendar, Save, X } from "lucide-react";

type DashboardData = {
  user: {
    name: string;
    surname: string;
    birthDate: Date | null;
    phone: string | null;
    email: string | null;
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

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    phone: "",
    avatar: "",
  });

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

  useEffect(() => {
    if (!data) return;

    setFormData({
      name: data.user.name,
      surname: data.user.surname,
      email: data.user.email ?? "",
      birthDate: data.user.birthDate
        ? new Date(data.user.birthDate).toISOString().slice(0, 10)
        : "",
      phone: data.user.phone ?? "",
      avatar: data.user.avatar ?? "",
    });

    setAvatarPreview(data.user.avatar);
  }, [data]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (!data) return null;
  // Mock student data
  const { user, stats } = data;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("surname", formData.surname);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("birthDate", formData.birthDate);

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const res = await fetch(`${host_name}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      if (!res.ok) {
        throw new Error("Ошибка сохранения профиля");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Профиль обновлён",
        description: "Ваши изменения успешно сохранены.",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить профиль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <DashboardLayout showBack title="Редактировать профиль">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <Card variant="glow" className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_hsl(259_100%_59%/0.4)]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-display font-bold text-xl text-foreground mb-1">
                    {user.name} {user.surname}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">
                    Уровень {stats.level} • {stats.coins} монет
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Изменить аватар
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card variant="glass" className="mb-6">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Данные ученика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Имя
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите имя"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Фамилия
                  </label>
                  <Input
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Введите фамилию"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Дата рождения
                </label>
                <Input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Телефон
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="cosmic"
              size="lg"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Сохраняем...</span>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
            >
              <X className="w-5 h-5 mr-2" />
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
