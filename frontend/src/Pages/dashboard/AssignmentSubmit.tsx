import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  FileText, 
  Send,
  Paperclip,
  Code,
  Upload,
  X
} from 'lucide-react';

const AssignmentSubmit = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  const assignment = {
    id: assignmentId,
    title: 'Практика: Калькулятор',
    module: 'Переменные и типы данных',
    codeTemplate: `# Калькулятор на Python
# Напишите ваше решение здесь

num1 = float(input("Введите первое число: "))
num2 = float(input("Введите второе число: "))
operation = input("Введите операцию (+, -, *, /): ")

# Ваш код для вычисления
`,
  };

  const handleSubmit = () => {
    if (!code.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваше решение",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Решение отправлено!",
      description: "Преподаватель проверит вашу работу в ближайшее время",
    });

    navigate(`/dashboard/courses/${courseId}`);
  };

  const handleFileAdd = () => {
    setFiles([...files, `file_${files.length + 1}.py`]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout showBack title="Выполнение задания">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card variant="glow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground mb-1">{assignment.title}</h1>
                <Badge variant="secondary">{assignment.module}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Ваше решение
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={assignment.codeTemplate}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm bg-space-dark border-border/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Напишите или вставьте ваш код Python в поле выше
            </p>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-secondary" />
              Прикреплённые файлы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                    <button
                      onClick={() => handleFileRemove(index)}
                      className="p-1 hover:bg-destructive/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <Button variant="outline" onClick={handleFileAdd} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Прикрепить файл
            </Button>
          </CardContent>
        </Card>

        {/* Comment */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="font-display">Комментарий (необязательно)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Опишите ваше решение, задайте вопросы преподавателю..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] bg-card/50 border-border/50 resize-none"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={`/dashboard/courses/${courseId}/assignment/${assignmentId}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к заданию
            </Button>
          </Link>
          <Button variant="cosmic" className="flex-1" onClick={handleSubmit}>
            <Send className="w-4 h-4 mr-2" />
            Отправить решение
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentSubmit;
