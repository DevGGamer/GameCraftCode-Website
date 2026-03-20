import { useState, useEffect } from 'react';
import api from '@/api';
import './CoursesPage.css';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    duration: 20,
    description: '',
    lessons: [],
    course_icon_path: '',
    links: [] 
  });
  

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get(`/api/courses`);
      setCourses(res.data.courses);
    } catch (err) {
      console.error('Ошибка загрузки курсов', err);
    }
  };

  const handleInput = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingId(course.id);
      setForm({
        name: course.name,
        duration: course.duration,
        description: course.description,
        lessons: course.lessons || [],
        course_icon_path: course.course_icon_path || '',
        links: course.links || []
      });      
    } else {
      setEditingId(null);
      setForm({ name: '', duration: 20, description: '', lessons: [], course_icon_path: null, links: []});
    }
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    try {
      const newLessons = form.lessons.filter(l => !l.id && l.video);
      for (const lesson of newLessons) {
        await api.delete(`/api/video`, { data: { lesson } });
      }
    } catch (err) {
      console.error('Ошибка при отмене', err);
    }
    setIsModalOpen(false);
    setForm({ name: '', duration: 20, description: '', lessons: [], course_icon_path: null, links: []});
    setEditingId(null);
  };

  const saveCourse = async () => {
    const payload = {
      name: form.name,
      duration: form.duration,
      description: form.description,
      lessons: form.lessons.map(({ title, video, description }) => ({ title, video, description })),
      course_icon_path: form.course_icon_path,
      links: form.links
    };    

    try {
      if (editingId) {
        await api.put(`/api/courses/${editingId}`, payload);
      } else {
        await api.post(`/api/courses`, payload);
      }
      await loadCourses();
      closeModal();
    } catch (err) {
      console.error('Ошибка сохранения', err);
    }
  };

  const uploadIcon = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await api.post(`/api/upload-icon/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleInput('course_icon_path', res.data.imagePath);
    } catch (err) {
      console.error('Ошибка загрузки иконки', err);
    }
  };

  const deleteCourse = async (id) => {
    if (confirm('Удалить курс?')) {
      try {
        await api.delete(`/api/courses/${id}`);
        loadCourses();
      } catch (err) {
        console.error('Ошибка удаления', err);
      }
    }
  };

  const addLesson = () => {
    setForm(prev => ({
      ...prev,
      lessons: [...prev.lessons, { id: null, title: '', video: null, description: '' }]
    }));
  };  

  const updateLesson = (index, field, value) => {
    const updated = [...form.lessons];
    updated[index][field] = value;
    setForm({ ...form, lessons: updated });
  };

  const deleteLesson = (index) => {
    const lesson = form.lessons[index];
    if (!lesson.id || confirm('Удалить урок?')) {
      setForm(prev => ({
        ...prev,
        lessons: prev.lessons.filter((_, i) => i !== index)
      }));
    }
  };

  const toggleLessonSettings = (index) => {
    const updated = [...form.lessons];
    updated[index].isExpanded = !updated[index].isExpanded;
    setForm({ ...form, lessons: updated });
  };

  const uploadVideo = async (index, file) => {
    const formData = new FormData();
    formData.append('video', file);
    try {
      const res = await api.post(`/api/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateLesson(index, 'video', res.data.path);
    } catch (err) {
      console.error('Ошибка загрузки видео', err);
    }
  };

  const addLink = () => {
    setForm(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }]
    }));
  };
  
  const updateLink = (index, field, value) => {
    const updated = [...form.links];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, links: updated }));
  };
  
  const deleteLink = (index) => {
    setForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="courses-panel">
      <button className="add-course-button" onClick={() => openModal()}>
        Добавить курс
      </button>

      <div className="courses-container">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className='course-info'>
              <h3>{course.name}</h3>
              <p><strong>Длительность:</strong> {course.duration} часов</p>
            </div>
            <div className="card-buttons">
              <button className="edit-btn" onClick={() => openModal(course)}>Редактировать</button>
              <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Удалить</button>
            </div> 
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="course-modal">
            <h2>{editingId ? 'Редактирование курса' : 'Создание курса'}</h2>

            <label>Название:
              <input value={form.name} onChange={e => handleInput('name', e.target.value)} />
            </label>

            <label>Продолжительность в часах:
              <input
                type="number"
                value={form.duration}
                onChange={e => handleInput('duration', e.target.value)}
              />
            </label>

            <label>Иконка курса:
              <input
                type="file"
                accept="image/*"
                onChange={e => uploadIcon(e.target.files[0])}
              />
            </label>

            {form.course_icon_path && (
              <img
                src={`${form.course_icon_path}`}
                alt="Иконка курса"
                style={{ width: '120px', marginTop: '10px', borderRadius: '8px', border: '1px solid #0ff' }}
              />
            )}

            <label>Описание:
              <textarea
                value={form.description}
                onChange={e => handleInput('description', e.target.value)}
              />
            </label>

            <div className="links-section">
              <h3>Полезные ссылки</h3>
              {form.links.map((link, index) => (
                <div key={index} className="link-row">
                  <input
                    type="text"
                    placeholder="Название"
                    value={link.title}
                    onChange={e => updateLink(index, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={e => updateLink(index, 'url', e.target.value)}
                  />
                  <button onClick={() => deleteLink(index)}>🗑</button>
                </div>
              ))}
              <button className="add-lesson-btn" onClick={addLink}>+ Добавить ссылку</button>
            </div>

            <div className="lessons-section">
              <h3>Уроки</h3>
              {form.lessons.map((lesson, index) => (
                <div key={index} className="lesson-tile">
                  <div className="lesson-header">
                    <input
                      className="lesson-title-input"
                      placeholder="Название урока"
                      value={lesson.title}
                      onChange={e => updateLesson(index, 'title', e.target.value)}
                    />
                    <div>
                      <button onClick={() => toggleLessonSettings(index)}>⚙️</button>
                      <button onClick={() => deleteLesson(index)}>🗑</button>
                    </div>
                  </div>
                  {lesson.isExpanded && (
                    <div className="lesson-settings">
                      <label>Описание:
                          <textarea
                            value={lesson.description || ''}
                            onChange={e => updateLesson(index, 'description', e.target.value)}
                          />
                      </label>
                      <label>Видео:
                        <input
                          type="file"
                          accept="video/*"
                          onChange={e => uploadVideo(index, e.target.files[0])}
                        />
                      </label>
                      {lesson.video && (
                        <video width="300" controls src={`/uploads/videos/${lesson.video}`} />
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button className="add-lesson-btn" onClick={addLesson}>+ Добавить урок</button>
            </div>

            <div className="modal-buttons">
              <button onClick={saveCourse}>Сохранить</button>
              <button onClick={closeModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
