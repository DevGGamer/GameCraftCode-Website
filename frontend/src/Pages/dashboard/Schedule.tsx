import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Calendar, Clock, Video, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    
    return weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleString('ru-RU', { month: 'short' }),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const lessons = [
    {
      id: 1,
      title: 'Python: Вложенные циклы',
      course: 'Python для начинающих',
      date: weekDates[0].fullDate,
      time: '16:00 - 17:30',
      type: 'live',
      instructor: 'Анна Петрова',
    },
    {
      id: 2,
      title: 'Python: Практика циклов',
      course: 'Python для начинающих',
      date: weekDates[2].fullDate,
      time: '16:00 - 17:30',
      type: 'live',
      instructor: 'Анна Петрова',
    },
    {
      id: 3,
      title: 'HTML: Основы вёрстки',
      course: 'Веб-разработка: HTML & CSS',
      date: weekDates[4].fullDate,
      time: '18:00 - 19:30',
      type: 'live',
      instructor: 'Михаил Козлов',
    },
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: 'Python: Вложенные циклы',
      course: 'Python для начинающих',
      date: 'Понедельник, 29 января',
      time: '16:00 - 17:30',
      type: 'live',
    },
    {
      id: 2,
      title: 'Python: Практика циклов',
      course: 'Python для начинающих',
      date: 'Среда, 31 января',
      time: '16:00 - 17:30',
      type: 'live',
    },
    {
      id: 3,
      title: 'HTML: Основы вёрстки',
      course: 'Веб-разработка: HTML & CSS',
      date: 'Пятница, 2 февраля',
      time: '18:00 - 19:30',
      type: 'live',
    },
    {
      id: 4,
      title: 'Python: Функции (часть 1)',
      course: 'Python для начинающих',
      date: 'Понедельник, 5 февраля',
      time: '16:00 - 17:30',
      type: 'live',
    },
    {
      id: 5,
      title: 'CSS: Стилизация страниц',
      course: 'Веб-разработка: HTML & CSS',
      date: 'Пятница, 9 февраля',
      time: '18:00 - 19:30',
      type: 'recorded',
    },
  ];

  const getLessonsForDate = (date: Date) => {
    return lessons.filter(lesson => 
      lesson.date.toDateString() === date.toDateString()
    );
  };

  return (
    <DashboardLayout title="Расписание">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card variant="glow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Календарь занятий</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground min-w-[120px] text-center">
                  {weekDates[0].date} {weekDates[0].month} - {weekDates[6].date} {weekDates[6].month}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDates.map((item, index) => (
                  <div 
                    key={index}
                    className={`text-center p-3 rounded-xl transition-colors ${
                      item.isToday 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card/50'
                    }`}
                  >
                    <div className="text-xs font-medium opacity-70">{item.day}</div>
                    <div className="text-lg font-bold">{item.date}</div>
                  </div>
                ))}
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-7 gap-2 min-h-[200px]">
                {weekDates.map((item, index) => {
                  const dayLessons = getLessonsForDate(item.fullDate);
                  return (
                    <div key={index} className="space-y-2">
                      {dayLessons.map(lesson => (
                        <div 
                          key={lesson.id}
                          className={`p-2 rounded-lg text-xs ${
                            lesson.type === 'live' 
                              ? 'bg-primary/20 border border-primary/30' 
                              : 'bg-secondary/20 border border-secondary/30'
                          }`}
                        >
                          <div className="font-medium text-foreground truncate">{lesson.title}</div>
                          <div className="text-muted-foreground mt-1">{lesson.time.split(' - ')[0]}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Онлайн-занятие</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm text-muted-foreground">Запись</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Lessons */}
        <div>
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="font-display text-base">Ближайшие занятия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingLessons.map((lesson) => (
                <div 
                  key={lesson.id}
                  className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground text-sm">{lesson.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`shrink-0 ${
                        lesson.type === 'live' 
                          ? 'border-primary/50 text-primary' 
                          : 'border-secondary/50 text-secondary'
                      }`}
                    >
                      {lesson.type === 'live' ? (
                        <>
                          <Video className="w-3 h-3 mr-1" />
                          Live
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3 h-3 mr-1" />
                          Запись
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{lesson.course}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {lesson.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
