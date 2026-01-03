import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  QrCode,
  CreditCard,
  Info,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const BalanceTopUp = () => {
  const [currentBalance] = useState(1250);

  // Mock QR code data URL (in production this would be generated dynamically)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    "https://pay.example.ru/pixelverse?amount=1000"
  )}`;

  const topUpAmounts = [500, 1000, 2000, 5000];

  return (
    <DashboardLayout title="Пополнение баланса">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Balance Card */}
        <Card variant="glow" className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Текущий баланс
                  </p>
                  <p className="text-4xl font-display font-bold text-foreground">
                    {currentBalance.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Активный аккаунт
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Payment */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <QrCode className="w-5 h-5 text-primary" />
                Оплата по QR-коду
              </CardTitle>
              <CardDescription>
                Отсканируйте код камерой телефона для быстрой оплаты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <img
                    src={qrCodeUrl}
                    alt="QR код для оплаты"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Откройте приложение камеры или банковское приложение на
                    телефоне
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Наведите камеру на QR-код и отсканируйте его
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Введите сумму пополнения и подтвердите оплату
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Top-Up Amounts */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="w-5 h-5 text-secondary" />
                Быстрое пополнение
              </CardTitle>
              <CardDescription>
                Выберите сумму для пополнения баланса
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {topUpAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-16 text-lg font-bold hover:border-primary hover:bg-primary/10 transition-all"
                    onClick={() =>
                      window.open(
                        `https://pay.example.ru/pixelverse?amount=${amount}`,
                        "_blank"
                      )
                    }
                  >
                    {amount.toLocaleString("ru-RU")} ₽
                  </Button>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button variant="cosmic" className="w-full" size="lg">
                  <span>Другая сумма</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Info */}
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">Способы оплаты</h3>
                <p className="text-sm text-muted-foreground">
                  Мы принимаем оплату через все популярные российские платёжные
                  системы: банковские карты (Мир, Visa, Mastercard), СБП,
                  Сбербанк Онлайн, ЮMoney и другие электронные кошельки.
                </p>
                <p className="text-xs text-muted-foreground">
                  Все платежи защищены и обрабатываются через сертифицированные
                  платёжные шлюзы.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BalanceTopUp;
