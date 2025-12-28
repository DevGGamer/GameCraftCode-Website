import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Старт",
    price: "3 900",
    period: "месяц",
    description: "Для знакомства с программированием",
    features: [
      "4 занятия в месяц",
      "Доступ к материалам курса",
      "Групповые занятия до 8 человек",
      "Домашние задания с проверкой",
      "Чат с преподавателем",
    ],
    popular: false,
  },
  {
    name: "Продвинутый",
    price: "6 900",
    period: "месяц",
    description: "Оптимальный выбор для результата",
    features: [
      "8 занятий в месяц",
      "Доступ ко всем материалам",
      "Группы до 6 человек",
      "Персональная обратная связь",
      "Участие в хакатонах",
      "Сертификат по окончании",
    ],
    popular: true,
  },
  {
    name: "Индивидуальный",
    price: "12 900",
    period: "месяц",
    description: "Персональное обучение 1 на 1",
    features: [
      "8 индивидуальных занятий",
      "Полный доступ к платформе",
      "Персональная программа",
      "Гибкое расписание",
      "Подготовка к олимпиадам",
      "Карьерные консультации",
      "Приоритетная поддержка",
    ],
    popular: false,
  },
];

const PricingSection = () => {
const scrollToEnrollment = () => {
    const element = document.querySelector('#enrollment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="starfield opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Тарифы </span>
            <span className="bg-gradient-to-r from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] bg-clip-text text-transparent">
              обучения
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Выберите подходящий формат — от групповых занятий до персональных уроков
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              variant={plan.popular ? "popular" : "glow"}
              className={`relative ${plan.popular ? "scale-105 z-10" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[hsl(258,100%,59%)] to-[hsl(233,100%,67%)] text-primary-foreground text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4" fill="currentColor" />
                    Популярный
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">₽/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[hsl(258,100%,59%,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[hsl(258,100%,59%)]" />
                      </div>
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "cosmic" : "cosmicOutline"} 
                  className="w-full"
                  size="lg"
                  onClick={scrollToEnrollment}
                >
                  Выбрать тариф
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12">
          Первый урок — бесплатно! Попробуйте и убедитесь в качестве обучения
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
