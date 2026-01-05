import { useState, useMemo, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  Pencil,
  Trash2,
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Search,
  BookOpen,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const host_name = "http://localhost:8000";
type UserRole = "admin" | "student" | "teacher" | "parent";

const USERS_API_URL = `${host_name}/api/users`;
const COURSES_API_URL = `${host_name}/api/courses`;

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(USERS_API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Не удалось загрузить пользователей");
  return res.json();
}

async function createUserApi(payload: any) {
  const res = await fetch(USERS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Ошибка создания пользователя");
  return res.json();
}

async function updateUserApi(userId: string, payload: any) {
  const res = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Ошибка обновления пользователя");
  return res.json();
}

async function deleteUserApi(userId: string) {
  const res = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Ошибка удаления пользователя");
}

interface FormData {
  name: string;
  surname: string;
  phone: string;
  email: string;
  login: string;
  password: string;
  role: UserRole;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

interface CourseAssignment {
  courseId: string;
  teacherId: string;
  startDate: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Админ",
  student: "Ученик",
  teacher: "Учитель",
  parent: "Родитель",
};

const roleIcons: Record<UserRole, typeof Shield> = {
  admin: Shield,
  student: GraduationCap,
  teacher: BookOpen,
  parent: Heart,
};

type BaseUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: "admin" | "student" | "teacher" | "parent";
};

type StudentCourseInfo = {
  course_id: string;
  teacher_id: string;
  start_date?: string;
};

export type StudentUser = BaseUser & {
  role: "student";
  parent_id?: string;
  courses: StudentCourseInfo[];
};

export type ParentUser = BaseUser & {
  role: "parent";
  children: string[];
};

export type TeacherUser = BaseUser & {
  role: "teacher";
  courses: string[];
};

export type AdminUser = BaseUser & {
  role: "admin";
};

export type User = StudentUser | ParentUser | TeacherUser | AdminUser;

const AdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    login: "",
    password: "",
    role: "student",
  });

  const [courseAssignments, setCourseAssignments] = useState<
    CourseAssignment[]
  >([]);
  const [selectedChildrenIds, setSelectedChildrenIds] = useState<string[]>([]);
  const [selectedTeachingCourseIds, setSelectedTeachingCourseIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        console.log(data);
        setUsers(data);
      } catch (e) {
        console.error(e);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить пользователей",
          variant: "destructive",
        });
      }
    };

    loadUsers();
  }, [toast]);

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch(COURSES_API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("COURSES RESPONSE:", data);
        setCourses(data);
      });
  }, []);

  const allStudents = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users]
  );

  const allTeachers = useMemo(
    () => users.filter((u) => u.role === "teacher"),
    [users]
  );

  const getTeachersForCourse = useCallback(
    (courseId: string) => {
      return allTeachers.filter((teacher) =>
        teacher.courses?.includes(courseId)
      );
    },
    [allTeachers]
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      surname: "",
      phone: "",
      email: "",
      login: "",
      password: "",
      role: "student",
    });
    setCourseAssignments([]);
    setSelectedChildrenIds([]);
    setSelectedTeachingCourseIds([]);
  }, []);

  const handleCreateUser = useCallback(async () => {
    try {
      // Формируем payload в соответствии с backend
      let payload: any = {
        role: formData.role,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        login: formData.login,
        password: formData.password,
      };

      if (formData.role === "student") {
        payload.parent_id = selectedChildrenIds[0] || null;
        payload.courses = courseAssignments.map((ca) => ({
          course_id: ca.courseId,
          teacher_id: ca.teacherId,
          start_date: ca.startDate,
        }));
      } else if (formData.role === "parent") {
        payload.children = selectedChildrenIds;
      } else if (formData.role === "teacher") {
        payload.courses = selectedTeachingCourseIds;
      }

      await createUserApi(payload);

      // Сразу обновляем список пользователей
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);

      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Пользователь создан",
        description: `${formData.name} ${formData.surname} успешно добавлен`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Ошибка",
        description: "Не удалось создать пользователя",
        variant: "destructive",
      });
    }
  }, [
    formData,
    courseAssignments,
    selectedChildrenIds,
    selectedTeachingCourseIds,
    resetForm,
    toast,
  ]);

  const handleEditUser = useCallback(async () => {
    if (!selectedUser) return;

    try {
      let payload: any = {
        login: formData.login,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.role === "student") {
        payload.parent_id = selectedChildrenIds[0] || null;
        payload.courses = courseAssignments.map((ca) => ({
          course_id: ca.courseId,
          teacher_id: ca.teacherId,
          start_date: ca.startDate,
        }));
      } else if (formData.role === "parent") {
        payload.children = selectedChildrenIds;
      } else if (formData.role === "teacher") {
        payload.courses = selectedTeachingCourseIds;
      }

      await updateUserApi(selectedUser.id, payload);

      // Обновляем список
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      toast({
        title: "Пользователь обновлён",
        description: "Данные успешно сохранены",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пользователя",
        variant: "destructive",
      });
    }
  }, [
    selectedUser,
    formData,
    courseAssignments,
    selectedChildrenIds,
    selectedTeachingCourseIds,
    resetForm,
    toast,
  ]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await deleteUserApi(selectedUser.id);

      // Обновляем список
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Пользователь удалён",
        description: `${selectedUser.name} ${selectedUser.surname} удалён из системы`,
        variant: "destructive",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      });
    }
  }, [selectedUser, toast]);

  const openEditDialog = useCallback((user: User) => {
    setSelectedUser(user);

    setFormData({
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      login: "",
      password: "",
      role: user.role,
    });

    if (user.role === "teacher") {
      setSelectedTeachingCourseIds(user.courses || []);
    } else {
      setSelectedTeachingCourseIds([]);
    }

    if (user.role === "parent") {
      setSelectedChildrenIds(user.children || []);
    } else {
      setSelectedChildrenIds([]);
    }

    if (user.role === "student") {
      setCourseAssignments(
        user.courses?.map((c) => ({
          courseId: c.course_id,
          teacherId: c.teacher_id,
          startDate: c.start_date || "",
        })) || []
      );
    } else {
      setCourseAssignments([]);
    }

    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const addCourseAssignment = useCallback(() => {
    setCourseAssignments((prev) => [
      ...prev,
      { courseId: "", teacherId: "", startDate: "" },
    ]);
  }, []);

  const updateCourseAssignment = useCallback(
    (index: number, field: string, value: string) => {
      setCourseAssignments((prev) => {
        const updated = [...prev];
        if (field === "courseId") {
          updated[index] = {
            ...updated[index],
            courseId: value,
            teacherId: "",
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
      });
    },
    []
  );

  const removeCourseAssignment = useCallback((index: number) => {
    setCourseAssignments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleChildSelection = useCallback((studentId: string) => {
    setSelectedChildrenIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  }, []);

  const toggleTeachingCourse = useCallback((courseId: string) => {
    setSelectedTeachingCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  }, []);

  const getParentName = useCallback(
    (parentId?: string) => {
      if (!parentId) return null;
      const parent = users.find(
        (u) => u.id === parentId && u.role === "parent"
      );
      return parent ? `${parent.name} ${parent.surname}` : null;
    },
    [users]
  );

  const getChildrenNames = useCallback(
    (childrenIds?: string[]) => {
      if (!childrenIds || childrenIds.length === 0) return null;
      return childrenIds
        .map((id) => {
          const child = users.find((u) => u.id === id && u.role === "student");
          return child ? `${child.name} ${child.surname}` : null;
        })
        .filter(Boolean)
        .join(", ");
    },
    [users]
  );

  const getTeachingCourseNames = useCallback(
    (user: User) => {
      if (user.role !== "teacher" || !user.courses) return null;
      return user.courses
        .map((courseId) => courses.find((c) => c.id === courseId)?.name)
        .filter(Boolean)
        .join(", ");
    },
    [courses]
  );

  // Form field change handlers - using stable callbacks
  const handleFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, name: e.target.value }));
    },
    []
  );

  const handleLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, surname: e.target.value }));
    },
    []
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, phone: e.target.value }));
    },
    []
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, email: e.target.value }));
    },
    []
  );

  const handleLoginChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, login: e.target.value }));
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, password: e.target.value }));
    },
    []
  );

  const handleRoleChange = useCallback((value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }));
  }, []);

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
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
          >
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
                <TableHead className="text-muted-foreground">
                  Электронная почта
                </TableHead>
                <TableHead className="text-muted-foreground">Роль</TableHead>
                <TableHead className="text-muted-foreground">Связи</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <TableRow
                    key={user.id}
                    className="border-border/30 hover:bg-card/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {user.surname}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-destructive/20 text-destructive"
                            : user.role === "teacher"
                            ? "bg-primary/20 text-primary"
                            : user.role === "student"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-pink-500/20 text-pink-500"
                        }`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {roleLabels[user.role]}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                      {user.role === "student" &&
                        (user as StudentUser).parent_id && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-pink-500" />
                            <span className="truncate">
                              Родитель:{" "}
                              {getParentName((user as StudentUser).parent_id)}
                            </span>
                          </div>
                        )}

                      {user.role === "parent" &&
                        (user as ParentUser).children &&
                        (user as ParentUser).children.length > 0 && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-secondary" />
                            <span className="truncate">
                              Дети:{" "}
                              {getChildrenNames((user as ParentUser).children)}
                            </span>
                          </div>
                        )}
                      {user.role === "teacher" &&
                        user.courses &&
                        user.courses.length > 0 && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-primary" />
                            <span className="truncate">
                              Курсы: {getTeachingCourseNames(user)}
                            </span>
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
            <DialogTitle className="text-foreground">
              Создать пользователя
            </DialogTitle>
            <DialogDescription>
              Заполните данные нового пользователя
            </DialogDescription>
          </DialogHeader>

          {/* Form Fields - Inline instead of component to prevent re-renders */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Имя</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={handleFirstNameChange}
                  placeholder="Введите имя"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-surname">Фамилия</Label>
                <Input
                  id="create-surname"
                  value={formData.surname}
                  onChange={handleLastNameChange}
                  placeholder="Введите фамилию"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-phone">Телефон</Label>
                <Input
                  id="create-phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Электронная почта</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-login">Логин</Label>
              <Input
                id="create-login"
                value={formData.login}
                onChange={handleLoginChange}
                placeholder="Введите логин"
              />

              <div></div>

              <Label htmlFor="create-password">Пароль</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Введите пароль"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-role">Роль пользователя</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
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
            {formData.role === "teacher" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Ведёт курсы
                </Label>
                <p className="text-sm text-muted-foreground">
                  Выберите курсы, которые ведёт преподаватель
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedTeachingCourseIds.includes(course.id)
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-background/50 border border-border/30 hover:border-primary/30"
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
            {formData.role === "parent" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Дети (ученики)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Выберите учеников, для которых этот пользователь является
                  родителем
                </p>
                {allStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет зарегистрированных учеников
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {allStudents.map((student) => (
                      <label
                        key={student.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedChildrenIds.includes(student.id)
                            ? "bg-pink-500/20 border border-pink-500/50"
                            : "bg-background/50 border border-border/30 hover:border-pink-500/30"
                        }`}
                      >
                        <Checkbox
                          checked={selectedChildrenIds.includes(student.id)}
                          onCheckedChange={() =>
                            toggleChildSelection(student.id)
                          }
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium">
                            {student.name} {student.surname}
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
            {formData.role === "student" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Назначенные курсы
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCourseAssignment}
                  >
                    + Добавить курс
                  </Button>
                </div>

                {courseAssignments.map((assignment, index) => {
                  const availableTeachers = assignment.courseId
                    ? getTeachersForCourse(assignment.courseId)
                    : [];

                  return (
                    <div
                      key={index}
                      className="space-y-3 p-3 rounded-lg bg-background/50"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Курс
                          </Label>
                          <Select
                            value={assignment.courseId}
                            onValueChange={(value) =>
                              updateCourseAssignment(index, "courseId", value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Выберите курс" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Преподаватель
                          </Label>
                          <Select
                            value={assignment.teacherId}
                            onValueChange={(value) =>
                              updateCourseAssignment(index, "teacherId", value)
                            }
                            disabled={!assignment.courseId}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue
                                placeholder={
                                  !assignment.courseId
                                    ? "Сначала выберите курс"
                                    : availableTeachers.length === 0
                                    ? "Нет преподавателей"
                                    : "Выберите преподавателя"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTeachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name} {teacher.surname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {assignment.courseId &&
                            availableTeachers.length === 0 && (
                              <p className="text-xs text-amber-500">
                                ⚠️ Нет преподавателей для этого курса
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Дата начала
                          </Label>
                          <Input
                            type="date"
                            className="h-9"
                            value={assignment.startDate}
                            onChange={(e) =>
                              updateCourseAssignment(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleCreateUser}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Редактировать пользователя
            </DialogTitle>
            <DialogDescription>Измените данные пользователя</DialogDescription>
          </DialogHeader>

          {/* Form Fields - Inline instead of component to prevent re-renders */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">Имя</Label>
                <Input
                  id="edit-firstName"
                  value={formData.name}
                  onChange={handleFirstNameChange}
                  placeholder="Введите имя"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Фамилия</Label>
                <Input
                  id="edit-lastName"
                  value={formData.surname}
                  onChange={handleLastNameChange}
                  placeholder="Введите фамилию"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Телефон</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Электронная почта</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Роль пользователя</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
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
            {formData.role === "teacher" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Ведёт курсы
                </Label>
                <p className="text-sm text-muted-foreground">
                  Выберите курсы, которые ведёт преподаватель
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedTeachingCourseIds.includes(course.id)
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-background/50 border border-border/30 hover:border-primary/30"
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
            {formData.role === "parent" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Дети (ученики)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Выберите учеников, для которых этот пользователь является
                  родителем
                </p>
                {allStudents.filter((s) => s.id !== selectedUser?.id).length ===
                0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет зарегистрированных учеников
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {allStudents
                      .filter((s) => s.id !== selectedUser?.id)
                      .map((student) => (
                        <label
                          key={student.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            selectedChildrenIds.includes(student.id)
                              ? "bg-pink-500/20 border border-pink-500/50"
                              : "bg-background/50 border border-border/30 hover:border-pink-500/30"
                          }`}
                        >
                          <Checkbox
                            checked={selectedChildrenIds.includes(student.id)}
                            onCheckedChange={() =>
                              toggleChildSelection(student.id)
                            }
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium">
                              {student.name} {student.surname}
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
            {formData.role === "student" && (
              <div className="space-y-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Назначенные курсы
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCourseAssignment}
                  >
                    + Добавить курс
                  </Button>
                </div>

                {courseAssignments.map((assignment, index) => {
                  const availableTeachers = assignment.courseId
                    ? getTeachersForCourse(assignment.courseId)
                    : [];

                  return (
                    <div
                      key={index}
                      className="space-y-3 p-3 rounded-lg bg-background/50"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Курс
                          </Label>
                          <Select
                            value={assignment.courseId}
                            onValueChange={(value) =>
                              updateCourseAssignment(index, "courseId", value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Выберите курс" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Преподаватель
                          </Label>
                          <Select
                            value={assignment.teacherId}
                            onValueChange={(value) =>
                              updateCourseAssignment(index, "teacherId", value)
                            }
                            disabled={!assignment.courseId}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue
                                placeholder={
                                  !assignment.courseId
                                    ? "Сначала выберите курс"
                                    : availableTeachers.length === 0
                                    ? "Нет преподавателей"
                                    : "Выберите преподавателя"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTeachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name} {teacher.surname}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {assignment.courseId &&
                            availableTeachers.length === 0 && (
                              <p className="text-xs text-amber-500">
                                ⚠️ Нет преподавателей для этого курса
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Дата начала
                          </Label>
                          <Input
                            type="date"
                            className="h-9"
                            value={assignment.startDate}
                            onChange={(e) =>
                              updateCourseAssignment(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleEditUser}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Удалить пользователя?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить пользователя {selectedUser?.name}{" "}
              {selectedUser?.surname}? Это действие нельзя отменить.
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
