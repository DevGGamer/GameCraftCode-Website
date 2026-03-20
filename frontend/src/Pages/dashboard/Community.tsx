import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Community = () => {
  return (
    <DashboardLayout title="Сообщество">
      <Card variant="glass">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold mb-2">Раздел в разработке</h3>
            <p className="text-muted-foreground">
              Скоро здесь появится сообщество учеников: посты, обсуждения и таблица лидеров
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Community;
