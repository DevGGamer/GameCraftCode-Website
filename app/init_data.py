from .database import Base, engine, SessionLocal
from .models import Users, Courses
from minio import Minio

# создаем таблицы
Base.metadata.create_all(bind=engine)

minio_client = Minio(
    "localhost:4000",
    access_key="admin",
    secret_key="adminpas",
    secure=False
)

def assign_user(student_login: str, password: str, role: str):
    db: Session = SessionLocal()

    # ищем студента по login
    user = db.query(Users).filter_by(login=student_login).first()

    if not user:
        # создаём нового студента
        user = Users(
            login=student_login,
            password = password,
            role=role,
        )
        db.add(user)
        db.commit()

    db.close()
    return user

def assign_course(student_id: int, course_name: str, teacher_id: int):
    db: Session = SessionLocal()

    # создаём нового студента
    course = Courses(
        student_id=student_id,
        course_name=course_name,
        completed_lessons = 0,
        teacher_id=teacher_id,
    )
    db.add(course)
    db.commit()

    db.close()
    return course

#assign_user('admin', "1234", "admin")

assign_course(3, "python", 2)