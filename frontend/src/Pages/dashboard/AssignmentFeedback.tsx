import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2,
  Star,
  MessageSquare,
  Code,
  Award,
  User,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

const AssignmentFeedback = () => {
  const { courseId, assignmentId } = useParams();

  // Mock feedback data
  const feedback = {
    assignment: {
      id: assignmentId,
      title: 'Практика: Калькулятор',
      module: 'Переменные и типы данных',
    },
    submittedAt: '18 января 2024, 15:30',
    reviewedAt: '19 января 2024, 10:15',
    grade: 95,
    maxGrade: 100,
    status: 'excellent', // excellent, good, needs_improvement
    instructor: {
      name: 'Анна Петрова',
      role: 'Senior Python Developer',
    },
    submittedCode: `# Калькулятор на Python
num1 = float(input("Введите первое число: "))
num2 = float(input("Введите второе число: "))
operation = input("Введите операцию (+, -, *, /): ")

if operation == '+':
    result = num1 + num2
elif operation == '-':
    result = num1 - num2
elif operation == '*':
    result = num1 * num2
elif operation == '/':
    if num2 != 0:
        result = num1 / num2
    else:
        print("Ошибка: деление на ноль!")
        result = None
else:
    print("Неизвестная операция")
    result = None

if result is not None:
    print(f"Результат: {result}")`,
    comments: [
      {
        type: 'positive',
        text: 'Отличная обработка деления на ноль! Вы правильно проверили, что второе число не равно нулю.',
      },
      {
        type: 'positive',
        text: 'Хорошее использование f-строк для форматирования вывода.',
      },
      {
        type: 'suggestion',
        text: 'Рекомендация: можно добавить цикл while True, чтобы программа работала несколько раз до команды выхода.',
      },
    ],
    criteria: [
      { name: 'Базовые операции', score: 25, maxScore: 25 },
      { name: 'Обработка ошибок', score: 25, maxScore: 25 },
      { name: 'Качество кода', score: 23, maxScore: 25 },
      { name: 'Дополнительные функции', score: 22, maxScore: 25 },
    ],
    earnedBadge: {
      name: 'Python Мастер',
      description: 'За отличное выполнение задания по Python',
    },
  };

  const getGradeColor = () => {
    if (feedback.grade >= 90) return 'text-green-400';
    if (feedback.grade >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = () => {
    switch (feedback.status) {
      case 'excellent':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Отлично</Badge>;
      case 'good':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Хорошо</Badge>;
      default:
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Требует доработки</Badge>;
    }
  };

  return (
    <DashboardLayout showBack title="Результаты проверки">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Grade */}
        <Card variant="glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-display font-bold text-foreground">{feedback.assignment.title}</h1>
                    {getStatusBadge()}
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.assignment.module}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Отправлено: {feedback.submittedAt} • Проверено: {feedback.reviewedAt}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-5xl font-display font-bold ${getGradeColor()}`}>
                  {feedback.grade}%
                </div>
                <p className="text-sm text-muted-foreground">Оценка</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submitted Code */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Ваше решение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-space-dark rounded-xl p-4 overflow-x-auto text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                  {feedback.submittedCode}
                </pre>
              </CardContent>
            </Card>

            {/* Instructor Comments */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  Комментарии преподавателя
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {feedback.comments.map((comment, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 p-4 rounded-xl border ${
                      comment.type === 'positive' 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-yellow-500/5 border-yellow-500/20'
                    }`}
                  >
                    {comment.type === 'positive' ? (
                      <ThumbsUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-foreground">{comment.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <Card variant="glass">
              <CardContent className="p-6">
                <h3 className="font-display font-bold mb-4">Проверил</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{feedback.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{feedback.instructor.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grading Criteria */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display text-base">Критерии оценки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.criteria.map((criterion, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{criterion.name}</span>
                      <span className="text-foreground font-medium">{criterion.score}/{criterion.maxScore}</span>
                    </div>
                    <Progress value={(criterion.score / criterion.maxScore) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Earned Badge */}
            {feedback.earnedBadge && (
              <Card variant="glow" className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-1">{feedback.earnedBadge.name}</h3>
                  <p className="text-sm text-muted-foreground">{feedback.earnedBadge.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Back to Course */}
            <Link to={`/dashboard/courses/${courseId}`}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к курсу
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentFeedback;
