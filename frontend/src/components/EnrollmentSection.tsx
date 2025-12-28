import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Mail, Phone, User, Calendar, Sparkles } from 'lucide-react';

const EnrollmentSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Заявка отправлена! 🚀",
      description: "Мы свяжемся с вами в ближайшее время для подбора программы.",
    });
    
    setFormData({
      parentName: '',
      childName: '',
      childAge: '',
      phone: '',
      email: '',
    });
    setIsSubmitting(false);
  };

  return (
    <section id="enrollment" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute left-1/3 top-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />
      <div className="absolute right-1/3 bottom-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">Начните </span>
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                космическое путешествие
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Оставьте заявку, и мы подберём идеальную программу для вашего ребёнка. 
              Первое занятие — бесплатно!
            </p>
          </div>

          <Card variant="glow" className="max-w-2xl mx-auto">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_hsl(259_100%_59%/0.4)]">
                <Rocket className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Записаться на обучение</CardTitle>
              <CardDescription>
                Заполните форму и мы свяжемся с вами в течение дня
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Имя родителя
                    </label>
                    <Input
                      name="parentName"
                      placeholder="Анна Иванова"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      Имя ребёнка
                    </label>
                    <Input
                      name="childName"
                      placeholder="Миша"
                      value={formData.childName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Возраст ребёнка
                    </label>
                    <Input
                      name="childAge"
                      type="number"
                      min="8"
                      max="17"
                      placeholder="12"
                      value={formData.childAge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Телефон
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="cosmic" 
                  size="xl" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Отправляем...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Записаться на бесплатный урок
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentSection;
