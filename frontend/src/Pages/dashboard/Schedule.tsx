import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const Schedule = () => {
  return (
    <DashboardLayout title="Расписание">
      <Card variant="glass">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold mb-2">Раздел в разработке</h3>
            <p className="text-muted-foreground">
              Скоро здесь появится расписание ваших занятий и календарь
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Schedule;
