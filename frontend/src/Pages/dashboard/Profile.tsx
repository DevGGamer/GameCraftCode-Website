import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { User, Camera, Calendar, Save, X } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Алексей',
    lastName: 'Морозов',
    email: 'alexey@example.com',
    birthDate: '2012-05-15',
    phone: '+7 (999) 123-45-67',
    parentName: 'Елена Морозова',
    parentEmail: 'elena@example.com',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Профиль обновлён",
      description: "Ваши изменения успешно сохранены.",
    });
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate('/dashboard');
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
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_hsl(259_100%_59%/0.4)]">
                    <User className="w-14 h-14 text-primary-foreground" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Camera className="w-5 h-5 text-foreground" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-display font-bold text-xl text-foreground mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-3">
                    Уровень 5 • 1,250 монет
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Изменить аватар
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info */}
          <Card variant="glass" className="mb-6">
            <CardHeader>
              <CardTitle className="font-display text-lg">Данные ученика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Имя</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Введите имя"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Фамилия</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
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
                <label className="text-sm font-medium text-foreground">Email ученика</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent Info */}
          <Card variant="glass" className="mb-6">
            <CardHeader>
              <CardTitle className="font-display text-lg">Данные родителя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">ФИО родителя</label>
                <Input
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Введите ФИО родителя"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email родителя</label>
                <Input
                  name="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Телефон</label>
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
