import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Achievements = () => {
  const { stats } = useAuth();

  return (
    <DashboardLayout title="Достижения">
      <div className="space-y-6">
        {/* Stats from API */}
        {stats && (
          <Card variant="glow">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stats.achievements}</div>
              <p className="text-muted-foreground text-sm">Достижений получено</p>
            </CardContent>
          </Card>
        )}

        {/* Placeholder */}
        <Card variant="glass">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold mb-2">Подробности в разработке</h3>
              <p className="text-muted-foreground">
                Скоро здесь появится детальный список достижений с прогрессом и наградами
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Achievements;
