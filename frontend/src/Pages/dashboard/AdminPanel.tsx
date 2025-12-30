import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Search,
  BookOpen,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'student' | 'teacher' | 'parent';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: UserRole;
  // Student-specific
  assignedCourses?: {
    courseId: string;
    courseName: string;
    teacherId: string;
    teacherName: string;
    startDate: string;
  }[];
  parentId?: string; // For students: linked parent
  // Parent-specific
  childrenIds?: string[]; // For parents: linked students
  // Teacher-specific
  teachingCourseIds?: string[]; // For teachers: courses they lead
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Админ',
  student: 'Ученик',
  teacher: 'Учитель',
  parent: 'Родитель',
};

const roleIcons: Record<UserRole, typeof Shield> = {
  admin: Shield,
  student: GraduationCap,
  teacher: BookOpen,
  parent: Heart,
};

const mockCourses = [
  { id: '1', name: 'Python для начинающих' },
  { id: '2', name: 'Создание игр на Scratch' },
  { id: '3', name: 'Веб-разработка' },
  { id: '4', name: 'Разработка мобильных приложений' },
];

const initialUsers: UserData[] = [
  {
    id: '1',
    firstName: 'Алексей',
    lastName: 'Смирнов',
    phone: '+7 (999) 123-45-67',
    email: 'alexey@example.com',
    role: 'student',
    parentId: '4',
    assignedCourses: [
      { courseId: '1', courseName: 'Python для начинающих', teacherId: '2', teacherName: 'Мария Иванова', startDate: '2024-01-15' }
    ]
  },
  {
    id: '2',
    firstName: 'Мария',
    lastName: 'Иванова',
    phone: '+7 (999) 234-56-78',
    email: 'maria@example.com',
    role: 'teacher',
    teachingCourseIds: ['1', '3'],
  },
  {
    id: '3',
    firstName: 'Дмитрий',
    lastName: 'Козлов',
    phone: '+7 (999) 345-67-89',
    email: 'dmitry@example.com',
    role: 'admin',
  },
  {
    id: '4',
    firstName: 'Елена',
    lastName: 'Волкова',
    phone: '+7 (999) 456-78-90',
    email: 'elena@example.com',
    role: 'parent',
    childrenIds: ['1'],
  },
  {
    id: '5',
    firstName: 'Андрей',
    lastName: 'Петров',
    phone: '+7 (999) 567-89-01',
    email: 'andrey@example.com',
    role: 'teacher',
    teachingCourseIds: ['2', '4'],
  },
  {
    id: '6',
    firstName: 'Анна',
    lastName: 'Сидорова',
    phone: '+7 (999) 678-90-12',
    email: 'anna@example.com',
    role: 'student',
    parentId: '4',
    assignedCourses: [
      { courseId: '2', courseName: 'Создание игр на Scratch', teacherId: '5', teacherName: 'Андрей Петров', startDate: '2024-02-01' }
    ]
  },
];

const AdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
  });
  
  // Student course assignments
  const [courseAssignments, setCourseAssignments] = useState<{
    courseId: string;
    teacherId: string;
    startDate: string;
  }[]>([]);

  // Parent-specific: selected children
  const [selectedChildrenIds, setSelectedChildrenIds] = useState<string[]>([]);
  
  // Teacher-specific: selected courses
  const [selectedTeachingCourseIds, setSelectedTeachingCourseIds] = useState<string[]>([]);

  // Get all students for parent selection
  const allStudents = useMemo(() => 
    users.filter(u => u.role === 'student'), 
    [users]
  );

  // Get all teachers for course assignment
  const allTeachers = useMemo(() => 
    users.filter(u => u.role === 'teacher'), 
    [users]
  );

  // Get teachers who teach a specific course
  const getTeachersForCourse = (courseId: string) => {
    return allTeachers.filter(teacher => 
      teacher.teachingCourseIds?.includes(courseId)
    );
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      role: 'student',
    });
    setCourseAssignments([]);
    setSelectedChildrenIds([]);
    setSelectedTeachingCourseIds([]);
  };

  const handleCreateUser = () => {
    const newUser: UserData = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
    };

    // Role-specific data
    if (formData.role === 'student') {
      newUser.assignedCourses = courseAssignments.map(ca => ({
        ...ca,
        courseName: mockCourses.find(c => c.id === ca.courseId)?.name || '',
        teacherName: allTeachers.find(t => t.id === ca.teacherId)?.firstName + ' ' + 
                     allTeachers.find(t => t.id === ca.teacherId)?.lastName || '',
      }));
    } else if (formData.role === 'parent') {
      newUser.childrenIds = selectedChildrenIds;
    } else if (formData.role === 'teacher') {
      newUser.teachingCourseIds = selectedTeachingCourseIds;
    }
    
    // Update parent references in students
    let updatedUsers = [...users, newUser];
    if (formData.role === 'parent' && selectedChildrenIds.length > 0) {
      updatedUsers = updatedUsers.map(u => 
        selectedChildrenIds.includes(u.id) 
          ? { ...u, parentId: newUser.id }
          : u
      );
    }

    setUsers(updatedUsers);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: 'Пользователь создан',
      description: `${newUser.firstName} ${newUser.lastName} успешно добавлен`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    let updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        const updatedUser: UserData = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
        };

        // Role-specific data
        if (formData.role === 'student') {
          updatedUser.assignedCourses = courseAssignments.map(ca => ({
            ...ca,
            courseName: mockCourses.find(c => c.id === ca.courseId)?.name || '',
            teacherName: allTeachers.find(t => t.id === ca.teacherId)?.firstName + ' ' + 
                         allTeachers.find(t => t.id === ca.teacherId)?.lastName || '',
          }));
          // Clear non-student fields
          delete updatedUser.childrenIds;
          delete updatedUser.teachingCourseIds;
        } else if (formData.role === 'parent') {
          updatedUser.childrenIds = selectedChildrenIds;
          // Clear non-parent fields
          delete updatedUser.assignedCourses;
          delete updatedUser.teachingCourseIds;
        } else if (formData.role === 'teacher') {
          updatedUser.teachingCourseIds = selectedTeachingCourseIds;
          // Clear non-teacher fields
          delete updatedUser.assignedCourses;
          delete updatedUser.childrenIds;
        } else {
          // Admin - clear all role-specific fields
          delete updatedUser.assignedCourses;
          delete updatedUser.childrenIds;
          delete updatedUser.teachingCourseIds;
        }

        return updatedUser;
      }
      return user;
    });

    // Update parent references in students if editing a parent
    if (formData.role === 'parent') {
      // Remove old parent references
      updatedUsers = updatedUsers.map(u => 
        u.parentId === selectedUser.id ? { ...u, parentId: undefined } : u
      );
      // Add new parent references
      updatedUsers = updatedUsers.map(u => 
        selectedChildrenIds.includes(u.id) ? { ...u, parentId: selectedUser.id } : u
      );
    }
    
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
    toast({
      title: 'Пользователь обновлён',
      description: 'Данные успешно сохранены',
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Clear references to this user
    let updatedUsers = users.filter(user => user.id !== selectedUser.id);
    
    // If deleting a parent, clear parentId from children
    if (selectedUser.role === 'parent') {
      updatedUsers = updatedUsers.map(u => 
        u.parentId === selectedUser.id ? { ...u, parentId: undefined } : u
      );
    }
    
    // If deleting a student, remove from parent's childrenIds
    if (selectedUser.role === 'student') {
      updatedUsers = updatedUsers.map(u => ({
        ...u,
        childrenIds: u.childrenIds?.filter(id => id !== selectedUser.id)
      }));
    }

    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    toast({
      title: 'Пользователь удалён',
      description: `${selectedUser.firstName} ${selectedUser.lastName} удалён из системы`,
      variant: 'destructive',
    });
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      password: '',
      role: user.role,
    });
    setCourseAssignments(user.assignedCourses?.map(ac => ({
      courseId: ac.courseId,
      teacherId: ac.teacherId,
      startDate: ac.startDate,
    })) || []);
    setSelectedChildrenIds(user.childrenIds || []);
    setSelectedTeachingCourseIds(user.teachingCourseIds || []);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const addCourseAssignment = () => {
    setCourseAssignments([...courseAssignments, { courseId: '', teacherId: '', startDate: '' }]);
  };

  const updateCourseAssignment = (index: number, field: string, value: string) => {
    const updated = [...courseAssignments];
    // If changing course, reset teacherId since teachers are course-specific
    if (field === 'courseId') {
      updated[index] = { ...updated[index], courseId: value, teacherId: '' };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setCourseAssignments(updated);
  };

  const removeCourseAssignment = (index: number) => {
    setCourseAssignments(courseAssignments.filter((_, i) => i !== index));
  };

  const toggleChildSelection = (studentId: string) => {
    setSelectedChildrenIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleTeachingCourse = (courseId: string) => {
    setSelectedTeachingCourseIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Get parent name for a student
  const getParentName = (parentId?: string) => {
    if (!parentId) return null;
    const parent = users.find(u => u.id === parentId);
    return parent ? `${parent.firstName} ${parent.lastName}` : null;
  };

  // Get children names for a parent
  const getChildrenNames = (childrenIds?: string[]) => {
    if (!childrenIds || childrenIds.length === 0) return null;
    return childrenIds
      .map(id => {
        const child = users.find(u => u.id === id);
        return child ? `${child.firstName} ${child.lastName}` : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  // Get course names for a teacher
  const getTeachingCourseNames = (courseIds?: string[]) => {
    if (!courseIds || courseIds.length === 0) return null;
    return courseIds
      .map(id => mockCourses.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const UserFormContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Введите имя"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Введите фамилию"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Электронная почта</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
      </div>

      {!selectedUser && (
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Введите пароль"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Роль пользователя</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Админ</SelectItem>
            <SelectItem value="student">Ученик</SelectItem>
            <SelectItem value="teacher">Учитель</SelectItem>
            <SelectItem value="parent">Родитель</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teacher Course Selection */}
      {formData.role === 'teacher' && (
        <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <Label className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Ведёт курсы
          </Label>
          <p className="text-sm text-muted-foreground">
            Выберите курсы, которые ведёт преподаватель
          </p>
          <div className="grid grid-cols-2 gap-3">
            {mockCourses.map(course => (
              <label
                key={course.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTeachingCourseIds.includes(course.id)
                    ? 'bg-primary/20 border border-primary/50'
                    : 'bg-background/50 border border-border/30 hover:border-primary/30'
                }`}
              >
                <Checkbox
                  checked={selectedTeachingCourseIds.includes(course.id)}
                  onCheckedChange={() => toggleTeachingCourse(course.id)}
                />
                <span className="text-sm font-medium">{course.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Parent Children Selection */}
      {formData.role === 'parent' && (
        <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            Дети (ученики)
          </Label>
          <p className="text-sm text-muted-foreground">
            Выберите учеников, для которых этот пользователь является родителем
          </p>
          {allStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет зарегистрированных учеников
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {allStudents
                .filter(s => s.id !== selectedUser?.id) // Don't show self
                .map(student => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedChildrenIds.includes(student.id)
                        ? 'bg-pink-500/20 border border-pink-500/50'
                        : 'bg-background/50 border border-border/30 hover:border-pink-500/30'
                    }`}
                  >
                    <Checkbox
                      checked={selectedChildrenIds.includes(student.id)}
                      onCheckedChange={() => toggleChildSelection(student.id)}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {student.email}
                      </span>
                    </div>
                  </label>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Student Course Assignments */}
      {formData.role === 'student' && (
        <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Назначенные курсы</Label>
            <Button type="button" variant="outline" size="sm" onClick={addCourseAssignment}>
              + Добавить курс
            </Button>
          </div>
          
          {courseAssignments.map((assignment, index) => {
            const availableTeachers = assignment.courseId 
              ? getTeachersForCourse(assignment.courseId)
              : [];
            
            return (
              <div key={index} className="space-y-3 p-3 rounded-lg bg-background/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Курс</Label>
                    <Select
                      value={assignment.courseId}
                      onValueChange={(value) => updateCourseAssignment(index, 'courseId', value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Выберите курс" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCourses.map(course => (
                          <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Преподаватель</Label>
                    <Select
                      value={assignment.teacherId}
                      onValueChange={(value) => updateCourseAssignment(index, 'teacherId', value)}
                      disabled={!assignment.courseId}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={
                          !assignment.courseId 
                            ? 'Сначала выберите курс' 
                            : availableTeachers.length === 0 
                              ? 'Нет преподавателей'
                              : 'Выберите преподавателя'
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {assignment.courseId && availableTeachers.length === 0 && (
                      <p className="text-xs text-amber-500">
                        ⚠️ Нет преподавателей для этого курса
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Дата начала</Label>
                    <Input
                      type="date"
                      className="h-9"
                      value={assignment.startDate}
                      onChange={(e) => updateCourseAssignment(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeCourseAssignment(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {courseAssignments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Курсы не назначены. Нажмите «Добавить курс» для назначения.
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout title="Админская панель">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
            <UserPlus className="w-4 h-4 mr-2" />
            Создать пользователя
          </Button>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">Имя</TableHead>
                <TableHead className="text-muted-foreground">Фамилия</TableHead>
                <TableHead className="text-muted-foreground">Телефон</TableHead>
                <TableHead className="text-muted-foreground">Электронная почта</TableHead>
                <TableHead className="text-muted-foreground">Роль</TableHead>
                <TableHead className="text-muted-foreground">Связи</TableHead>
                <TableHead className="text-muted-foreground text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <TableRow key={user.id} className="border-border/30 hover:bg-card/50">
                    <TableCell className="font-medium text-foreground">{user.firstName}</TableCell>
                    <TableCell className="text-foreground">{user.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-destructive/20 text-destructive' :
                        user.role === 'teacher' ? 'bg-primary/20 text-primary' :
                        user.role === 'student' ? 'bg-secondary/20 text-secondary' :
                        'bg-pink-500/20 text-pink-500'
                      }`}>
                        <RoleIcon className="w-3 h-3" />
                        {roleLabels[user.role]}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                      {user.role === 'student' && user.parentId && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-pink-500" />
                          <span className="truncate">Родитель: {getParentName(user.parentId)}</span>
                        </div>
                      )}
                      {user.role === 'parent' && user.childrenIds && user.childrenIds.length > 0 && (
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-secondary" />
                          <span className="truncate">Дети: {getChildrenNames(user.childrenIds)}</span>
                        </div>
                      )}
                      {user.role === 'teacher' && user.teachingCourseIds && user.teachingCourseIds.length > 0 && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-primary" />
                          <span className="truncate">Курсы: {getTeachingCourseNames(user.teachingCourseIds)}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Пользователи не найдены
            </div>
          )}
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Создать пользователя</DialogTitle>
            <DialogDescription>
              Заполните данные нового пользователя
            </DialogDescription>
          </DialogHeader>
          <UserFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateUser}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Редактировать пользователя</DialogTitle>
            <DialogDescription>
              Измените данные пользователя
            </DialogDescription>
          </DialogHeader>
          <UserFormContent />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditUser}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Удалить пользователя?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить пользователя {selectedUser?.firstName} {selectedUser?.lastName}? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminPanel;
