import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical,
  Video,
  FileText,
  Upload,
  BookOpen,
  ChevronLeft,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  type: 'video' | 'practice';
  files: { name: string; url: string }[];
}

interface Module {
  id: string;
  title: string;
  skills: string[];
  lessons: Lesson[];
}

interface CourseFormData {
  name: string;
  ageRange: string;
  icon: string;
  customIconUrl: string;
  useCustomIcon: boolean;
  color: string;
  customColor1: string;
  customColor2: string;
  useCustomColors: boolean;
  isImportant: boolean;
  description: string;
  modules: Module[];
}

const colorOptions = [
  { value: 'from-green-500 to-emerald-600', label: 'Зелёный', color1: '#22c55e', color2: '#059669' },
  { value: 'from-blue-500 to-cyan-600', label: 'Синий', color1: '#3b82f6', color2: '#0891b2' },
  { value: 'from-purple-500 to-pink-600', label: 'Фиолетовый', color1: '#a855f7', color2: '#db2777' },
  { value: 'from-orange-500 to-amber-600', label: 'Оранжевый', color1: '#f97316', color2: '#d97706' },
  { value: 'from-red-500 to-rose-600', label: 'Красный', color1: '#ef4444', color2: '#e11d48' },
  { value: 'from-primary to-secondary', label: 'Космический', color1: '#8b5cf6', color2: '#06b6d4' },
];

const iconOptions = ['🐍', '🎮', '🌐', '📱', '🤖', '🎨', '🔧', '💻', '🚀', '⭐', '🎯', '🧩'];

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewCourse = courseId === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CourseFormData>({
    name: isNewCourse ? '' : 'Python для начинающих',
    ageRange: isNewCourse ? '' : '10-14',
    icon: isNewCourse ? '🎮' : '🐍',
    customIconUrl: '',
    useCustomIcon: false,
    color: isNewCourse ? 'from-primary to-secondary' : 'from-green-500 to-emerald-600',
    customColor1: '#8b5cf6',
    customColor2: '#06b6d4',
    useCustomColors: false,
    isImportant: !isNewCourse,
    description: isNewCourse ? '' : 'Курс по основам программирования на Python для детей.',
    modules: isNewCourse ? [] : [
      {
        id: '1',
        title: 'Введение в Python',
        skills: ['Основы синтаксиса', 'Переменные', 'Типы данных'],
        lessons: [
          { id: 'l1', title: 'Что такое Python?', videoUrl: '', type: 'video', files: [] },
          { id: 'l2', title: 'Установка Python', videoUrl: '', type: 'video', files: [] },
          { id: 'l3', title: 'Первая программа', videoUrl: '', type: 'practice', files: [] },
        ]
      },
      {
        id: '2',
        title: 'Работа с данными',
        skills: ['Списки', 'Словари', 'Циклы'],
        lessons: [
          { id: 'l4', title: 'Списки и кортежи', videoUrl: '', type: 'video', files: [] },
          { id: 'l5', title: 'Практика со списками', videoUrl: '', type: 'practice', files: [] },
        ]
      }
    ],
  });

  const handleSave = () => {
    toast({
      title: isNewCourse ? 'Курс создан' : 'Курс сохранён',
      description: `«${formData.name}» успешно ${isNewCourse ? 'создан' : 'обновлён'}`,
    });
    navigate('/dashboard/methodologist');
  };

  // Handle custom icon upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          customIconUrl: reader.result as string,
          useCustomIcon: true 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Get the gradient style for preview
  const getGradientStyle = () => {
    if (formData.useCustomColors) {
      return {
        background: `linear-gradient(135deg, ${formData.customColor1}, ${formData.customColor2})`
      };
    }
    return {};
  };

  const getGradientClass = () => {
    if (formData.useCustomColors) {
      return '';
    }
    return `bg-gradient-to-br ${formData.color}`;
  };

  // Module management
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      skills: [],
      lessons: [],
    };
    setFormData({ ...formData, modules: [...formData.modules, newModule] });
  };

  const updateModule = (moduleId: string, field: keyof Module, value: string | string[]) => {
    setFormData({
      ...formData,
      modules: formData.modules.map(m => 
        m.id === moduleId ? { ...m, [field]: value } : m
      ),
    });
  };

  const removeModule = (moduleId: string) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter(m => m.id !== moduleId),
    });
  };

  // Lesson management
  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      videoUrl: '',
      type: 'video',
      files: [],
    };
    setFormData({
      ...formData,
      modules: formData.modules.map(m => 
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      ),
    });
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: string | { name: string; url: string }[]) => {
    setFormData({
      ...formData,
      modules: formData.modules.map(m => 
        m.id === moduleId 
          ? {
              ...m,
              lessons: m.lessons.map(l => 
                l.id === lessonId ? { ...l, [field]: value } : l
              ),
            }
          : m
      ),
    });
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setFormData({
      ...formData,
      modules: formData.modules.map(m => 
        m.id === moduleId 
          ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
          : m
      ),
    });
  };

  const handleSkillsChange = (moduleId: string, value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    updateModule(moduleId, 'skills', skills);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/methodologist')}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Назад
            </Button>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {isNewCourse ? 'Создание курса' : 'Редактирование курса'}
            </h1>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>

        {/* Course Settings */}
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 space-y-6">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Настройки курса
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Название курса</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите название курса"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRange">Возраст учеников</Label>
              <Select 
                value={formData.ageRange} 
                onValueChange={(value) => setFormData({ ...formData, ageRange: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите возраст" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8-10">8-10 лет</SelectItem>
                  <SelectItem value="10-12">10-12 лет</SelectItem>
                  <SelectItem value="10-14">10-14 лет</SelectItem>
                  <SelectItem value="12-16">12-16 лет</SelectItem>
                  <SelectItem value="14-17">14-17 лет</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Icon Selection with Tabs */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Иконка курса
            </Label>
            <Tabs 
              value={formData.useCustomIcon ? 'custom' : 'template'} 
              onValueChange={(v) => setFormData({ ...formData, useCustomIcon: v === 'custom' })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="template">Шаблонные</TabsTrigger>
                <TabsTrigger value="custom">Своя иконка</TabsTrigger>
              </TabsList>
              <TabsContent value="template" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon, useCustomIcon: false })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        formData.icon === icon && !formData.useCustomIcon
                          ? 'bg-primary/20 border-2 border-primary ring-2 ring-primary/30' 
                          : 'bg-card/50 border border-border/50 hover:border-primary/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="custom" className="mt-0">
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Загрузить изображение
                  </Button>
                  {formData.customIconUrl && (
                    <div className="relative">
                      <img 
                        src={formData.customIconUrl} 
                        alt="Custom icon" 
                        className="w-12 h-12 rounded-lg object-cover border-2 border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, customIconUrl: '', useCustomIcon: false })}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {!formData.customIconUrl && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Рекомендуемый размер: 128×128 пикселей
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Color Selection with Tabs */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Цвет плашки курса
            </Label>
            <Tabs 
              value={formData.useCustomColors ? 'custom' : 'template'} 
              onValueChange={(v) => setFormData({ ...formData, useCustomColors: v === 'custom' })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="template">Шаблонные</TabsTrigger>
                <TabsTrigger value="custom">Свой градиент</TabsTrigger>
              </TabsList>
              <TabsContent value="template" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value, useCustomColors: false })}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br transition-all ${
                        color.value === 'from-green-500 to-emerald-600' ? 'from-green-500 to-emerald-600' :
                        color.value === 'from-blue-500 to-cyan-600' ? 'from-blue-500 to-cyan-600' :
                        color.value === 'from-purple-500 to-pink-600' ? 'from-purple-500 to-pink-600' :
                        color.value === 'from-orange-500 to-amber-600' ? 'from-orange-500 to-amber-600' :
                        color.value === 'from-red-500 to-rose-600' ? 'from-red-500 to-rose-600' :
                        'from-primary to-secondary'
                      } ${
                        formData.color === color.value && !formData.useCustomColors
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' 
                          : 'hover:scale-110'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="custom" className="mt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color1" className="text-sm text-muted-foreground">Цвет 1 (начало градиента)</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="color1"
                        value={formData.customColor1}
                        onChange={(e) => setFormData({ ...formData, customColor1: e.target.value })}
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={formData.customColor1}
                        onChange={(e) => setFormData({ ...formData, customColor1: e.target.value })}
                        placeholder="#8b5cf6"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color2" className="text-sm text-muted-foreground">Цвет 2 (конец градиента)</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="color2"
                        value={formData.customColor2}
                        onChange={(e) => setFormData({ ...formData, customColor2: e.target.value })}
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={formData.customColor2}
                        onChange={(e) => setFormData({ ...formData, customColor2: e.target.value })}
                        placeholder="#06b6d4"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Предпросмотр градиента</Label>
                  <div 
                    className="h-16 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${formData.customColor1}, ${formData.customColor2})` }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
            <div>
              <Label htmlFor="important" className="text-base font-medium">Ключевой курс</Label>
              <p className="text-sm text-muted-foreground">Отметить курс как важный (приоритетный)</p>
            </div>
            <Switch
              id="important"
              checked={formData.isImportant}
              onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание курса</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание курса..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Course Preview */}
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 space-y-4">
          <h2 className="text-lg font-display font-bold text-foreground">Предпросмотр карточки курса</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
            <div 
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${getGradientClass()}`}
              style={getGradientStyle()}
            >
              {formData.useCustomIcon && formData.customIconUrl ? (
                <img 
                  src={formData.customIconUrl} 
                  alt="Course icon" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                formData.icon
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">
                {formData.name || 'Название курса'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formData.ageRange ? `${formData.ageRange} лет` : 'Возраст не указан'}
              </p>
            </div>
            {formData.isImportant && (
              <span className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold">
                ⭐ Ключевой
              </span>
            )}
          </div>
        </div>

        {/* Modules */}
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-foreground">Модули курса</h2>
            <Button variant="outline" size="sm" onClick={addModule}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить модуль
            </Button>
          </div>

          {formData.modules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Модули не добавлены</p>
              <p className="text-sm">Нажмите «Добавить модуль» для создания первого модуля</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {formData.modules.map((module, moduleIndex) => (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="border border-border/50 rounded-xl bg-background/30 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-card/50">
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {moduleIndex + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {module.title || 'Новый модуль'}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto mr-4">
                        {module.lessons.length} уроков
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label>Название модуля</Label>
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                          placeholder="Введите название модуля"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Получаемые навыки (через запятую)</Label>
                        <Input
                          value={module.skills.join(', ')}
                          onChange={(e) => handleSkillsChange(module.id, e.target.value)}
                          placeholder="Навык 1, Навык 2, Навык 3"
                        />
                      </div>
                    </div>

                    {/* Skills Preview */}
                    {module.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {module.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Lessons */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Уроки модуля</Label>
                        <Button variant="ghost" size="sm" onClick={() => addLesson(module.id)}>
                          <Plus className="w-3 h-3 mr-1" />
                          Добавить урок
                        </Button>
                      </div>

                      {module.lessons.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Уроки не добавлены
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/30"
                            >
                              <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                {lessonIndex + 1}
                              </span>
                              <Input
                                value={lesson.title}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                placeholder="Название урока"
                                className="flex-1 h-9"
                              />
                              <Select
                                value={lesson.type}
                                onValueChange={(value) => updateLesson(module.id, lesson.id, 'type', value)}
                              >
                                <SelectTrigger className="w-32 h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">
                                    <span className="flex items-center gap-1">
                                      <Video className="w-3 h-3" />
                                      Видео
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="practice">
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      Практика
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" title="Загрузить видео">
                                <Upload className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeLesson(module.id, lesson.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Remove Module */}
                    <div className="pt-2 border-t border-border/30">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeModule(module.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить модуль
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Bottom Save */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => navigate('/dashboard/methodologist')}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isNewCourse ? 'Создать курс' : 'Сохранить изменения'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseBuilder;
