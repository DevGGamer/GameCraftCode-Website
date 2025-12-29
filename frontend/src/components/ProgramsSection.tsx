import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Star, Code, Gamepad2, Brain, Cpu } from "lucide-react";

const programs = [
  {
    icon: Gamepad2,
    title: "Создание игр в Scratch",
    age: "8–10 лет",
    level: "Начальный",
    description: "Первые шаги в программировании через визуальное создание игр и анимаций",
    skills: ["Логика", "Анимация", "Игры"],
    color: "from-[hsl(280,80%,60%)] to-[hsl(320,80%,60%)]",
    slug: 'game-creation'
  },
  {
    icon: Code,
    title: "Python для начинающих",
    age: "11–13 лет",
    level: "Базовый",
    description: "Изучаем один из самых востребованных языков через проекты и мини-игры",
    skills: ["Python", "Алгоритмы", "Проекты"],
    color: "from-[hsl(200,80%,50%)] to-[hsl(230,80%,60%)]",
    slug: 'python-kids'
  },
  {
    icon: Rocket,
    title: "Веб-разработка",
    age: "12–15 лет",
    level: "Средний",
    description: "Создаём настоящие сайты с помощью HTML, CSS и JavaScript",
    skills: ["HTML/CSS", "JavaScript", "Сайты"],
    color: "from-[hsl(150,70%,45%)] to-[hsl(180,70%,50%)]",
    slug: 'web-development'
  },
  {
    icon: Brain,
    title: "Искусственный интеллект",
    age: "14–17 лет",
    level: "Продвинутый",
    description: "Погружаемся в машинное обучение и нейронные сети на практике",
    skills: ["ML", "Data Science", "AI"],
    color: "from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)]",
    slug: 'artificial-intelligence'
  },
  {
    icon: Cpu,
    title: "Разработка приложений",
    age: "13–16 лет",
    level: "Средний",
    description: "Учимся создавать мобильные приложения для Android и iOS",
    skills: ["React Native", "UI/UX", "Apps"],
    color: "from-[hsl(30,90%,55%)] to-[hsl(50,90%,55%)]",
    slug: 'mobile-apps'
  },
  {
    icon: Star,
    title: "Олимпиадное программирование",
    age: "12–17 лет",
    level: "Экспертный",
    description: "Готовим к участию в престижных олимпиадах по программированию",
    skills: ["C++", "Алгоритмы", "Олимпиады"],
    color: "from-[hsl(350,80%,55%)] to-[hsl(20,80%,55%)]",
    slug: 'game-design'
  },
];

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Программы </span>
            <span className="bg-gradient-to-r from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] bg-clip-text text-transparent">
              обучения
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            От первых шагов в Scratch до продвинутого программирования — 
            курсы для каждого возраста и уровня подготовки
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card 
              key={program.title} 
              variant="glow"
              className="overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${program.color}`} />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <program.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {program.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                <p className="text-sm text-[hsl(258,100%,59%)] font-medium">{program.age}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">
                  {program.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link to={`/course/${program.slug}`}>
                  <Button variant="cosmicOutline" className="w-full">
                      Подробнее
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
