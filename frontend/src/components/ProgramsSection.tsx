import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Gamepad2 } from "lucide-react";

const programs = [
  {
    icon: Code,
    title: "Программирование на Python",
    age: "10–16 лет",
    level: "С нуля",
    description: "От первой программы до собственной игры: tkinter-приложения, работа с API и полноценная аркада на Pygame",
    skills: ["Python", "Tkinter", "Pygame"],
    color: "from-[hsl(200,80%,50%)] to-[hsl(230,80%,60%)]",
    slug: 'python-kids'
  },
  {
    icon: Gamepad2,
    title: "Разработка игр на Unity",
    age: "10–16 лет",
    level: "С нуля",
    description: "Изучаем C# и Unity с нуля: от первого скрипта до полноценной 3D-игры с препятствиями, бонусами и меню",
    skills: ["C#", "Unity", "Геймдев"],
    color: "from-[hsl(350,80%,55%)] to-[hsl(20,80%,55%)]",
    slug: 'unity-gamedev'
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
            Курсы программирования для детей и подростков —
            от первой строчки кода до собственного проекта
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((program) => (
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
