import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './EducationPage.css';

const host_name = 'http://localhost';

function EducationPage() {
  const { id } = useParams(); 
  const [teacherImage, setTeacherImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const [openModules, setOpenModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const toggleModule = (title) => {
    setOpenModules((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(`${host_name}:8000/api/user_course/`, {
                      headers: { Authorization: `Bearer ${localStorage.token}`} });
      setCourses(res.data);
    };
    fetchCourses();
  }, []);
  
  const openCourseModal = async (course) => {
    setSelectedCourse(course);
    const image = await axios.get(`${host_name}:8000/api/user/image/${course.teacher_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.token}`} })
    setTeacherImage(image.data.imageUrl)
    setExpandedLessonIndex(null);

    await axios.get(`${host_name}:8080/api/course-relations/${course.id}/${id}`)
    .then(res => setSelectedPartner(res.data.partner))
    .catch(error => console.log(error.data));
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setExpandedLessonIndex(null);
  };

  const toggleLesson = (index) => {
    setExpandedLessonIndex(prev => (prev === index ? null : index));
  };
  console.log(courses[0]?.modules.modules)
  return (
    <div className="student-courses-page">
      {!selectedCourse && <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="education-course-card" onClick={() => openCourseModal(course)}>
            <img src={course.course_icon_path ? `${host_name}:8080${course.course_icon_path}`: "/default-course-image.png"} alt={course.course_name} />
            <h3>{course.course_name}</h3>
          </div>
        ))}
      </div>}

      {selectedCourse && (
          <div>
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>{selectedCourse.course_name}</h2>

            <div className='modules'>

              <div className='left'>

                {selectedVideo ? (
                  <video src={selectedVideo} controls autoPlay />
                ) : (
                  <div className="video-placeholder">
                    Выберите урок, чтобы воспроизвести видео
                  </div>
                )}

              </div>

              <div className='right'>

                {courses[0]?.modules?.modules?.map((module) => (
                  <div key={module.title} className="module">
                    <div
                      className="module-header"
                      onClick={() => toggleModule(module.title)}
                    >
                      <span>{module.title}</span>
                      <span className="arrow">
                        {openModules.includes(module.title) ? "▲" : "▼"}
                      </span>
                    </div>

                    {openModules.includes(module.title) && (
                      <div className="lessons">
                        {module.lessons.map((lesson, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVideo(lesson.video)}
                          >
                            {lesson.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
              </div>

            </div>
            
            <div className="tabs">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Описание курса
              </button>
              <button
                className={activeTab === "teacher" ? "active" : ""}
                onClick={() => setActiveTab("teacher")}
              >
                Преподаватель
              </button>
              <button
                className={activeTab === "lessons" ? "active" : ""}
                onClick={() => setActiveTab("lessons")}
              >
                Уроки
              </button>
              <button
                className={activeTab === "projects" ? "active" : ""}
                onClick={() => setActiveTab("projects")}
              >
                Проекты
              </button>
              <button
                className={activeTab === "links" ? "active" : ""}
                onClick={() => setActiveTab("links")}
              >
                Полезные ссылки
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                  <>
                  <p><strong>Длительность:</strong> {selectedCourse.duration} часов</p>
                  <p dangerouslySetInnerHTML={{ __html: selectedCourse.description }}></p>
                      </>
                    )}

                    {activeTab === "lessons" && (
                      <div className="lessons-list">
                        {(selectedCourse.lessons || []).map((lesson, index) => (
                          <div key={index} className="lesson-tile">
                            <div className="lesson-header" onClick={() => toggleLesson(index)}>
                              <span>{lesson.video_name || `Урок ${index + 1}`}</span>
                              <button>🔽</button>
                            </div>
                            {expandedLessonIndex === index && (
                              <div className="lesson-body">
                                {lesson.description && (
                                  <p className="lesson-description"><strong>Описание:</strong> <span dangerouslySetInnerHTML={{ __html: lesson.description }}></span></p>
                                )}
                                {lesson.video ? (
                                  <video width="100%" height="auto" controls src={lesson.video}></video>
                                ) : (
                                  <p>Видео не добавлено</p>
                                )}
                              </div>
                            )}

                                </div>
                              ))}
                          </div>
                    )}
                    {activeTab === "teacher" && selectedCourse && (
                      <div className="teacher-card">
                        <img
                          className="teacher-avatar"
                          src={teacherImage}
                          alt="Преподаватель"
                        />
                        <div className="teacher-details">
                          <h3>{selectedCourse.teacher_name} {selectedCourse.teacher_surname}</h3>
                          <p className="teacher-bio">Ваш персональный преподаватель по этому курсу.</p>
                          {false && (
                            <a className="meet-link" href={selectedPartner.google_meet_url} target="_blank" rel="noopener noreferrer">
                              📹 Перейти к видеозанятию
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "projects" && (
                      <div>
                        <p>Тут будут проекты курса.</p>
                      </div>
                    )}

                  {activeTab === "links" && (
                    <div className="links-block">
                      <h3>Общие ссылки:</h3>
                      {(selectedCourse.links || []).map((link, i) => (
                        <div key={i}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                          <p>{link.description}</p>
                        </div>
                      ))}

                      {/*
                      {selectedPartnerLinks?.length > 0 && (
                        <>
                          <h3>Персональные ссылки от преподавателя:</h3>
                          {selectedPartnerLinks.map((link, i) => (
                            <div key={i}>
                              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                              <p>{link.description}</p>
                            </div>
                          ))}
                        </>
                      )}
                      */}
                    </div>
                  )}
                  </div>
                      </div>

                  )}
                </div>
              );
}

export default EducationPage;