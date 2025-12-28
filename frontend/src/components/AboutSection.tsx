import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Code2, Gamepad2, Users } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Игровое обучение",
    description: "Дети создают собственные игры и приложения, изучая код через увлекательные проекты",
  },
  {
    icon: Lightbulb,
    title: "Развитие логики",
    description: "Программирование развивает критическое мышление и навыки решения сложных задач",
  },
  {
    icon: Code2,
    title: "Реальные навыки",
    description: "Учим популярным языкам: Python, JavaScript, Scratch — знания для будущей карьеры",
  },
  {
    icon: Users,
    title: "Опытные наставники",
    description: "Педагоги с опытом работы в IT компаниях и навыками работы с детьми",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="starfield opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Почему </span>
            <span className="bg-gradient-to-r from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] bg-clip-text text-transparent">
              PixelVerse?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Мы не просто учим программированию — мы вдохновляем детей создавать 
            собственные цифровые миры и готовим их к профессиям будущего
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="glow"
              className="p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
