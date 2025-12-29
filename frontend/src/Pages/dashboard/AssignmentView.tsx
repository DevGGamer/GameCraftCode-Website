import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  CheckCircle2,
  Circle,
  AlertCircle,
  Send,
  Paperclip,
  Code
} from 'lucide-react';

const AssignmentView = () => {
  const { courseId, assignmentId } = useParams();

  // Mock assignment data
  const assignment = {
    id: assignmentId,
    title: 'Практика: Калькулятор',
    module: 'Переменные и типы данных',
    status: 'not_started', // not_started, submitted, reviewed
    deadline: '20 января 2024',
    description: `
## Описание задания

Создайте простой калькулятор на Python, который может выполнять базовые математические операции.

### Требования:
1. Программа должна запрашивать у пользователя два числа
2. Программа должна спрашивать, какую операцию выполнить (+, -, *, /)
3. Программа должна выводить результат вычисления
4. При делении на ноль должно выводиться сообщение об ошибке

### Дополнительные баллы:
- Добавьте возможность вычисления степени числа
- Реализуйте проверку ввода (чтобы пользователь вводил только числа)
- Сделайте так, чтобы программа работала в цикле до команды выхода
    `,
    hints: [
      'Используйте функцию input() для получения данных от пользователя',
      'Не забудьте преобразовать строку в число с помощью int() или float()',
      'Для проверки операции используйте условные операторы if-elif-else',
    ],
    codeTemplate: `# Калькулятор на Python
# Ваш код здесь

# Получаем первое число от пользователя
num1 = float(input("Введите первое число: "))

# Получаем второе число
num2 = float(input("Введите второе число: "))

# Получаем операцию
operation = input("Введите операцию (+, -, *, /): ")

# Выполняем вычисление
# TODO: Добавьте логику вычисления

# Выводим результат
# TODO: Выведите результат
`,
  };

  const getStatusBadge = () => {
    switch (assignment.status) {
      case 'reviewed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Проверено</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">На проверке</Badge>;
      default:
        return <Badge className="bg-primary/20 text-primary border-primary/30">Не начато</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'reviewed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout showBack title={assignment.title}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Card variant="glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-display font-bold text-foreground">{assignment.title}</h1>
                    {getStatusBadge()}
                  </div>
                  <p className="text-sm text-muted-foreground">{assignment.module}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Дедлайн: {assignment.deadline}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display">Описание задания</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="text-foreground space-y-4 whitespace-pre-wrap">
                  {assignment.description.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={i} className="text-muted-foreground ml-4">{line.replace('- ', '')}</li>;
                    } else if (line.match(/^\d+\./)) {
                      return <li key={i} className="text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
                    }
                    return line ? <p key={i} className="text-muted-foreground">{line}</p> : null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Code Template */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Шаблон кода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-space-dark rounded-xl p-4 overflow-x-auto text-sm text-muted-foreground font-mono">
                  {assignment.codeTemplate}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon()}
                  <h3 className="font-display font-bold">Статус задания</h3>
                </div>
                
                {assignment.status === 'not_started' && (
                  <Link to={`/dashboard/courses/${courseId}/assignment/${assignmentId}/submit`}>
                    <Button variant="cosmic" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Выполнить задание
                    </Button>
                  </Link>
                )}
                
                {assignment.status === 'submitted' && (
                  <p className="text-sm text-muted-foreground text-center">
                    Ваше решение отправлено и ожидает проверки преподавателем
                  </p>
                )}
                
                {assignment.status === 'reviewed' && (
                  <Link to={`/dashboard/courses/${courseId}/assignment/${assignmentId}/feedback`}>
                    <Button variant="cosmic" className="w-full">
                      Посмотреть результат
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Hints */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="font-display text-base">Подсказки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignment.hints.map((hint, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <p className="text-sm text-muted-foreground">{hint}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentView;
