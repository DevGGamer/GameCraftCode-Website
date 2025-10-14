import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import './AdminUserPanel.css'

const host_name = 'http://localhost';
const API_URL = `${host_name}:8000/api/users`;

const today = new Date().toISOString().split("T")[0];

const defaultUser = {
  login: '',
  password: '',
  name: '',
  surname: '',
  birth_date: null,
  email: '',
  phone: '',
  role: 'student',
  need_confirmation: false,
  teacher: ''
};


function AdminUserPanel() {
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});

  const [showAddUser, setShowAddUser] = useState(false);
  const [formData, setFormData] = useState({ login: "", password: "", name: "",
    surname: "", email: "", role: "", phone: "", birth_date: "" });

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [courseTeachers, setCourseTeachers] = useState({});

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const [surnameFilter, setSurnameFilter] = useState('');
  const [confirmationFilter, setConfirmationFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchTeachers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  const fetchTeachers = async () => {
    await axios.get(`${host_name}:8000/api/teachers`)
    .then ((res) => {
      setTeachers(res.data);
    })
    .catch((error) => {
      console.error("Login error:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Status:", error.response.status);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    });
  };

  const handleChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const handleSave = async (user) => {
    if (user.id) {
      await axios.put(`${API_URL}/${user.id}`, user);
    } else {
      await axios.post(API_URL, user);
    }

    alert("Данные сохранены!")
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

     try {
    const response = await axios.post(`${host_name}:8000/api/add_user`, formData, {
      headers: { "Content-Type": "application/json" },
    });

    alert(`Успешно отправлено: ${JSON.stringify(response.data)}`);

    setShowPasswords(false);
    setFormData({ login: "", password: "", name: "",
    surname: "", email: "", role: "", phone: "", birth_date: "" });
  } catch (err) {
    alert(`Ошибка сервера: ${JSON.stringify(err.response.data)}`);
    console.error(err);
  }
    fetchUsers();
  };

  const fetchAllCourses = async () => {
    const res = await axios.get(`${host_name}:8000/api/courses`, {
                      headers: { Authorization: `Bearer ${localStorage.token}`} });
    setAllCourses(res.data);
  };
  
  const fetchUserCourses = async (userId) => {
    const res = await axios.get(`${host_name}:8000/api/user_course/${userId}`, {
                      headers: { Authorization: `Bearer ${localStorage.token}`} });
    setUserCourses(res.data);
  };

  const fetchUserTeacher = async (userID, courseID) => {
    try {
      const res = await axios.get(`${host_name}:8000/api/course-relations/${courseID}/${userID}`);
      const teacherId = res.data.partner.id;
  
      setCourseTeachers(prev => ({
        ...prev,
        [courseID]: teacherId
      }));
    } catch (error) {
      console.error("Ошибка при загрузке преподавателя:", error);
    }
  };  
  
  const handleConfigureCourses = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    await fetchAllCourses();
    await fetchUserCourses(user.id);

    userCourses.forEach(course => {
      fetchUserTeacher(user.id, course.id);
    });
  };
  
  const handleAddCourse = async () => {
    if (!selectedCourseId) return;
    const course = selectedCourseId.replace(/\//g, ">");
    await axios.get(`${host_name}:8000/api/add_user_course_and_teacher/${selectedUser.id}/${course}/${selectedTeacherId}`, {
                      headers: { Authorization: `Bearer ${localStorage.token}`} });
    setSelectedCourseId('');
    setSelectedTeacherId('');
    await fetchUserCourses(selectedUser.id);
  };
  
  const handleRemoveCourse = async (courseId) => {
    await axios.delete(`${host_name}:8000/api/user/${selectedUser.id}/courses/${courseId}`);
    await fetchUserCourses(selectedUser.id);
  };

  const handleTeacherChange = async (teacher_id) => {
    if (!teacher_id) return;
    try {
      await axios.get(`${host_name}:8000/api/add_user_course_or_teacher/${selectedUser.id}/${teacher_id}`, {
                      headers: { Authorization: `Bearer ${localStorage.token}`} });
  
    } catch (error) {
      console.error("Ошибка при обновлении преподавателя:", error);
    }
  };  

  const togglePasswordVisibility = (index) => {
    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index], 
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
};

const handleConfirmUser = async (user) => {
  user.need_confirmation = false;

  if (user.id) {
    await axios.put(`${API_URL}/${user.id}`, user);
  } else {
    await axios.post(API_URL, user);
  }

  fetchUsers();
};

const handleRejectUser = async (userId) => {
  await axios.delete(`${API_URL}/${userId}`);
  fetchUsers();
};

const filteredUsers = users.filter(user => {
  const surnameMatch = user.surname.toLowerCase().includes(surnameFilter.toLowerCase());
  const confirmationMatch =
    confirmationFilter === 'all' ||
    (confirmationFilter === 'active' && !user.need_confirmation) ||
    (confirmationFilter === 'pending' && user.need_confirmation);

  return surnameMatch && confirmationMatch;
});

  return (
    <div className="admin-panel">
      <button onClick={() => setShowAddUser(!showAddUser)} className="add-user-button">
        Добавить пользователя
      </button>
      {showAddUser && (
        <form
          onSubmit={handleAddUser}
          className="mt-4 p-4 border rounded shadow-md w-80"
        >
          <label className="block mb-2">
            Логин:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Пароль:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Имя:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Фмилия:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Email:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Роль:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Телефон:
            <input
              type="text"
              className="w-full border p-1 mt-1 rounded"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </label>
          <label className="block mb-2">
            Дата рождения:
            <input
              type="date"
              className="w-full border p-1 mt-1 rounded"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
            />
          </label>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Отправить
            </button>
          </div>
        </form>
      )}
      <div className="filters">
        <input
          type="text"
          placeholder="Фильтр по фамилии"
          value={surnameFilter}
          onChange={(e) => setSurnameFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={confirmationFilter}
          onChange={(e) => setConfirmationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="pending">Неподтвержденные</option>
        </select>
      </div>
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Настройка обучения для {selectedUser.name} {selectedUser.surname}</h3>

            {selectedUser.role == "student" && (
              <>
                <div className="course-select">
                  <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                    <option value="">Выберите курсы</option>
                    {allCourses
                      .filter(c => !userCourses.find(uc => uc.id === c.id))
                      .map(course => (
                        <option key={course.name} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                  <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}>
                    <option value="">Выберите преподавателя</option>
                    {teachers
                      .map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name} {teacher.surname}</option>
                    ))}
                  </select>
                  <button onClick={handleAddCourse}>Добавить</button>
                </div>

                <div className="assigned-courses">
                  {userCourses.map((course) => (
                    <div key = {course.id} className="course-pill">
                      <div>
                        <span>{course[0]}</span>
                        <span>{course[1]}</span>
                        <button onClick={() => handleRemoveCourse(course.id)}>Удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          
            <button className="modal-close-button" onClick={() => setShowModal(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Логин</th>
              <th>Пароль</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th className='desktop-display'>Дата рождения</th>
              <th className='desktop-display'>Почта</th>
              <th className='desktop-display'>Номер телефона</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredUsers.map((user, index) => (
              <tr key={index}>
                <td><input type="text" value={user.login} onChange={(e) => handleChange(index, 'login', e.target.value)} /></td>
                <td>
                  <input type={showPasswords[index] ? "text" : "password"} value={user.password} onChange={(e) => handleChange(index, 'password', e.target.value)} />
                  <span className="toggle-password" onClick={() => togglePasswordVisibility(index)}>
                        {showPasswords[index] ? <IoEyeOutline color="rgb(255, 255, 255)"/> : <IoEyeOffOutline color="rgb(255, 255, 255)"/>}
                    </span>
                </td>
                <td><input type="text" value={user.name} onChange={(e) => handleChange(index, 'name', e.target.value)} /></td>
                <td><input type="text" value={user.surname} onChange={(e) => handleChange(index, 'surname', e.target.value)} /></td>
                <td className='desktop-display'><input type="date" value={formatDate(user.birth_date)} onChange={(e) => handleChange(index, 'birth_date', e.target.value)} /></td>
                <td className='desktop-display'><input type="email" value={user.email} onChange={(e) => handleChange(index, 'email', e.target.value)} /></td>
                <td className='desktop-display'><input type="tel" value={user.phone} onChange={(e) => handleChange(index, 'phone', e.target.value)} /></td>
                <td>
                  <select value={user.role} onChange={(e) => handleChange(index, 'role', e.target.value)}>
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                {user.need_confirmation ? (
                <>
                  <button
                    className="save-button"
                    onClick={() => handleConfirmUser(user)}
                  >
                    Подтвердить
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    Отклонить
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleSave(user)} className="save-button">Сохранить</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">Удалить</button>
                  <div>
                    <button onClick={() => handleConfigureCourses(user)} className="course-button">Настроить обучение</button>
                  </div>
                </>
              )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  }

export default AdminUserPanel;
