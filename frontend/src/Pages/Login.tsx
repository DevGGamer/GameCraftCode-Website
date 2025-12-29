import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StarField from '@/components/StarField';
import { Rocket, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from "axios";

const host_name = 'http://localhost';

const Login = () => {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const checkToken = async () => {
            try {
                const res = await fetch(`${host_name}:8000/api/protected`, {
                  headers: {
                    authorization: `Bearer ${token}`
                  }
                });
    
                if (!res.ok)
                    return;
          
                localStorage.setItem('justLoggedIn', 'true'); 
                navigate(`/dashboard`);
              } catch (err) {
                
              }
            }
        
        checkToken();
      }, []);

  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));

    axios.post(`${host_name}:8000/api/login`, {
          login: formData.login,
          password: formData.password,
        })
        .then((response) => {
            const { token } = response.data;

            localStorage.setItem('justLoggedIn', 'true'); 
            localStorage.setItem("token", token);
            
            toast({
              title: "Добро пожаловать!",
              description: "Вход выполнен успешно.",
            });
            
            setIsLoading(false);
            navigate(`/dashboard`);
          })
          .catch((error) => {
            console.error("Login error:", error);
            if (error.response) {
              console.log("Response data:", error.response.data);
              console.log("Status:", error.response.status);
            } else if (error.request) {
              console.log("No response received:", error.request);
            } else {
              console.log("Request error:", error.message);
            }

            toast({
              title: "Упс! Что-то пошло не так :(",
              description: "Попробуйте ещё раз.",
            });
            
            setIsLoading(false);
          });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <StarField count={100} />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>

        <Card variant="glow" className="backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_hsl(259_100%_59%/0.4)]">
                <Rocket className="w-7 h-7 text-primary-foreground" />
              </div>
            </Link>
            <CardTitle className="text-2xl font-display">
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Личный кабинет
              </span>
            </CardTitle>
            <CardDescription className="mt-2">
              Войдите, чтобы продолжить обучение
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </label>
                <Input
                  name="login"
                  type="email"
                  placeholder="example@mail.ru"
                  value={formData.login}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Пароль
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Запомнить меня</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  Забыли пароль?
                </a>
              </div>
              
              <Button 
                type="submit" 
                variant="cosmic" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Входим...</span>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
