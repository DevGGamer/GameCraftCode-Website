from fastapi import FastAPI, Depends, Request, HTTPException, File, UploadFile, Header, status, Path, Form
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, Base, engine
from .auth import generate_token, verify_token
from datetime import datetime, timedelta, date
from .models import Users, Courses, UserAchievement, UserActivity
from sqlalchemy.orm import Session
from sqlalchemy import text
from minio.error import S3Error
from pydantic import BaseModel
from typing import Optional
from minio import Minio
from typing import List
import json
import io

def get_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    """
    Получаем токен из заголовка Authorization
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется токен"
        )
    return authorization.split(" ")[1]

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AddUserRequest(BaseModel):
    login: str
    password: str
    name: str
    surname: str
    email: str
    role: str
    phone: str
    birth_date: date

class LoginRequest(BaseModel):
    login: str
    password: str

class UserInfoRequest(BaseModel):
    name: str
    surname: str
    email: str | None
    phone: str | None
    birthDate : date | None
    avatar: UploadFile | None

# Простейший rate limiter (для примера)
login_attempts = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

MINIO_PUBLIC_URL = "localhost:4000"

minio_client = Minio(
    MINIO_PUBLIC_URL,
    access_key="admin",
    secret_key="adminpas",
    secure=False
)

@app.get("/api/protected", name='Проверка авторизации')
async def protected(payload: dict = Depends(verify_token)):
    print(f"Аутентификация для {payload['login']} подтверждена")
    
    return{"message": f"Создан пользователь {payload['login']}"}

@app.post("/api/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    login = data.login
    password = data.password

    if not isinstance(login, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Неверные данные")

    # Limit on the number of attempts
    client_ip = request.client.host
    attempts = login_attempts.get(client_ip, {"count":0, "time": datetime.utcnow()})
    if attempts["count"] >= 10 and (datetime.utcnow() - attempts["time"]).seconds < 600:
        raise HTTPException(status_code=429, detail="Слишком много попыток входа. Повторите позже.")

    user = db.query(Users).filter(Users.login == login).first()
    if not user or password != user.password:
        # increase the counter of unsuccessful attempts
        attempts["count"] += 1
        attempts["time"] = datetime.utcnow()
        login_attempts[client_ip] = attempts
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    # reset the counter after a successful login
    login_attempts[client_ip] = {"count":0, "time": datetime.utcnow()}

    token = generate_token({"id": user.id, "login": user.login, "role": user.role})
    return {"message": "Успешный вход", "token": token, "user": {"id": user.id, "name": user.name}}

@app.get("/api/profile")
def get_user_profile(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = db.query(Users).filter(Users.id == payload["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # record activity
    track_activity(user.id, db)

    # achievements
    achievements = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user.id)
        .count()
    )

    # streak (Postgres)
    streak = get_streak(user.id, db)

    avatar = get_avatar_url(user.id)

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "phone" : user.phone,
            "birthDate" : user.birth_date,
            "role": user.role,
            "avatar": avatar,
        },
        "stats": {
            "achievements": achievements,
            "streak": streak,
            "coins": user.coins,
            "balance": user.balance,
            "level": user.level
        }
    }

def get_avatar_url(user_id: int) -> str | None:
    object_name = f"{user_id}/avatar.png"
    try:
        # Checking if an object exists
        minio_client.stat_object("users", object_name)
        # Generate a temporary URL for 1 hour
        url = minio_client.presigned_get_object(
            "users",
            object_name,
            expires=timedelta(hours=1)
        )
        return url
    except S3Error:
        return None

def get_streak(user_id: int, db: Session) -> int:
    query = text("""
        SELECT COUNT(*) AS streak
        FROM (
            SELECT
                activity_date,
                activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date DESC))::int AS grp
            FROM user_activity
            WHERE user_id = :user_id
        ) t
        WHERE grp = current_date - 1
    """)
    result = db.execute(query, {"user_id": user_id}).scalar()
    return result or 0

def track_activity(user_id: int, db: Session):
    today = date.today()

    exists = (
        db.query(UserActivity)
        .filter(
            UserActivity.user_id == user_id,
            UserActivity.activity_date == today
        )
        .first()
    )

    if not exists:
        db.add(UserActivity(
            user_id=user_id,
            activity_date=today
        ))
        db.commit()

@app.put("/api/profile")
def update_user_profile(
    name: str = Form(...),
    surname: str = Form(...),
    email: str = Form(...),
    phone: str | None = Form(None),
    birthDate: date | None = Form(None),
    avatar: UploadFile | None = File(None),

    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(Users).filter(Users.id == payload["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.name = name
    user.surname = surname
    user.email = email
    user.phone = phone
    user.birth_date = birthDate

    if avatar:
        if avatar.content_type not in ("image/png", "image/jpeg", "image/webp"):
            raise HTTPException(status_code=400, detail="Неподдерживаемый формат изображения")

        object_name = f"{user.id}/avatar.png"

        content = avatar.file.read()

        minio_client.put_object(
            bucket_name="users",
            object_name=object_name,
            data=io.BytesIO(content),
            length=len(content),
            content_type="image/png",
        )

    db.commit()

    return {"message": "Профиль обновлён"}
    

@app.post("/api/add_user")
async def submit_form(data: AddUserRequest, db: Session = Depends(get_db)):
    db: Session = SessionLocal()

    user = db.query(Users).filter_by(login=data.login).first()

    if not user:
        user = Users(
            login=data.login,
            password = data.password,
            name=data.name,
            surname=data.surname,
            email=data.email,
            role=data.role,
            phone=data.phone,
            birth_date=data.birth_date,

        )
        db.add(user)
        db.commit()

    db.close()
    return {"status": "ok"}

@app.get("/api/user/image/")
@app.get("/api/user/image/{id}")
def get_user_image(id: Optional[int] = None, payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    if (id is None):
        bucket_name = payload['login']
    else:
        user = db.query(Users).filter(Users.id == id).first()
        bucket_name = user.login
    object_name = "фото.jpg"

    # проверяем бакет и объект
    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Бакет пользователя не найден")
    try:
        minio_client.stat_object(bucket_name, object_name)
    except Exception:
        raise HTTPException(status_code=404, detail="Изображение не найдено")

    # генерируем presigned URL на 1 час (3600 секунд)
    image_url = minio_client.get_presigned_url(
        "GET",
        bucket_name,
        object_name,
        expires=timedelta(seconds=3600)
    )

    return {"imageUrl": image_url}

@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    students = db.query(Users).filter(Users.role == "student").all()
    return students

@app.get("/api/teachers")
def get_users(db: Session = Depends(get_db)):
    teachers = db.query(Users).filter(Users.role == "teacher").all()
    return teachers

@app.get("/api/courses")
def get_courses(payload: dict = Depends(verify_token)):
    all_courses_data = []

    for obj in minio_client.list_objects("courses", recursive=False):
        file_data = minio_client.get_object("courses", f"{obj.object_name}passport.json")
        data = json.loads(file_data.read().decode("utf-8"))
        file_data.close()
        file_data.release_conn()
        #for key, info in data.items():
        all_courses_data.append({"name": data[0]["name"], "description": data[0]["description"] })
        
    return all_courses_data

@app.get("/api/user_course/")
@app.get("/api/user_course/{student_id}")
def get_courses(student_id: Optional[int] = None, payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    if (student_id is None):
        student_id = payload["id"]
    cours=[]
    courses = db.query(Courses).filter(Courses.student_id == student_id).all()

    for course in courses:
        teacher = db.query(Users).filter(Users.id == course.teacher_id).first()
        avatar_t = get_avatar_url(teacher.id)
        file_data = minio_client.get_object("courses", f"{course.course_name}/passport.json")
        data = json.loads(file_data.read().decode("utf-8"))
        file_data.close()
        file_data.release_conn()
        data2 = data[1]
        k=0
        com=0
        for i, module in enumerate(data2.get("modules", [])):
            prefix = f"{course.course_name}/Module{module['id']}/"
            objects = minio_client.list_objects("courses", prefix=prefix, recursive=True)
            l=0
            for obj in objects:
                if obj.object_name.endswith((".mp4", ".MP4")):
                    k+=1
                    video_name = obj.object_name.split("/")[-1]
                    url = minio_client.presigned_get_object("courses", obj.object_name)
                    data2["modules"][i]["items"][int(video_name[1])-1]["video"] = url
                    if (course.completed_lessons != None):
                        if int(video_name[1]) in course.completed_lessons[i+1]:
                            data2["modules"][i]["items"][int(video_name[1])-1]["completed"] = True
                            c+=1
                        else:
                            data2["modules"][i]["items"][int(video_name[1])-1]["completed"] = False
                    l+=1
            data2["modules"][i]["lessons"] = l
            data2["modules"][i]["completed"] = com 
            if l == com:
                data2["modules"][i]["status"] = "completed"
            else:
                data2["modules"][i]["status"] = "in-progress"
        if course.completed_lessons == None or course.completed_lessons == {}:
            progr=0
        else:
            progr = round(k/com * 100)
        if progr == 100:
            active = False
        else:
            active = True
        c = {"title": data[0]["title"], "level": data[0]["level"], "description": data[0]["description"], 
             "duration": data[0]["duration"], "teacher_id": course.teacher_id, "completedLessons": com, 
             "totalLessons": k, "progress": progr, "isActive": active, "name": course.course_name, "startDate": course.start_date,
             "instructor": { "surname": teacher.surname, "name": teacher.name, "title": "Senior Python Developer", "avatar": avatar_t }, 
             "modules": data2["modules"]}
        cours.append(c)

    return cours

@app.get("/api/add_user_course_and_teacher/{student_id}/{course_name}/{block_number}/{teacher_id}")
def get_courses(student_id: int, course_name: str, block_number: int, teacher_id: str, payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db: Session = SessionLocal()

    user = Courses(
        student_id=student_id,
        completed_lessons = 0,
        teacher_id=teacher_id,
        block_number=block_number,
        course_name=course_name.replace(">", "/"),
    )

    db.add(user)
    db.commit()

    db.close()

    return {"status": "ok"}

@app.get("/api/coursesf")
def get_coursesf(payload: dict = Depends(verify_token)):
    BUCKET_COURSES = "courses"
    try:
        # Словарь: {курс: [уроки]}
        courses_map: Dict[str, List[Dict]] = {}

        # Получаем все объекты в бакете
        objects = minio_client.list_objects(BUCKET_COURSES, recursive=True)
        for obj in objects:
            # Пример obj.object_name: "python/C1/L1.mp4"
            parts = obj.object_name.split("/")
            if len(parts) < 3:
                continue  # игнорируем некорректные пути

            course_name = parts[0]      # python
            chapter_name = parts[1]     # C1
            lesson_file = parts[2]      # L1.mp4

            course_key = f"{course_name}/{chapter_name}"
            if course_key not in courses_map:
                courses_map[course_key] = []

            # создаем presigned URL для видео
            video_url = minio_client.get_presigned_url(
                "GET",
                BUCKET_COURSES,
                obj.object_name,
                expires=3600  # 1 час
            )

            courses_map[course_key].append({
                "title": lesson_file,
                "video": video_url
            })

        # Преобразуем словарь в список для фронтенда
        courses_list = []
        for course, lessons in courses_map.items():
            courses_list.append({
                "course": course,
                "lessons": lessons
            })

        return {"courses": courses_list}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Ошибка сервера")

@app.get("/api/lessons/{student_name}")
def get_lessons(student_name: str):
    db: Session = SessionLocal()
    student = db.query(Users).filter(Users.name == student_name).first()
    if not student:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")

    # Получаем все уроки ученика, упорядоченные по order
    student_lessons = db.query(Lesson).filter(Lesson.student_id == student.id)\
                          .order_by(Lesson.order).all()

    result = []
    for i, lesson in enumerate(student_lessons):
        accessible = True if i == 0 or student_lessons[i-1].completed else False
        result.append({
            "id": lesson.id,
            "title": f"Lesson {lesson.order}",
            "video_name": lesson.video_name,
            "completed": lesson.completed,
            "accessible": accessible
        })
    db.close()
    return result

@app.post("/api/lessons/{student_name}/{lesson_id}/start")
def start_lesson(student_name: str, lesson_id: int):
    db = SessionLocal()
    student = db.query(Users).filter(Users.name == student_name).first()
    if not student:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.student_id == student.id).first()
    if not lesson:
        db.close()
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Presigned URL для видео из бакета, имя курса = бакет
    url = minio_client.presigned_get_object(student.course, lesson.video_name)
    db.close()
    return {"video_url": url}

@app.post("/api/lessons/{student_name}/{lesson_id}/complete")
def complete_lesson(student_name: str, lesson_id: int):
    db = SessionLocal()
    student = db.query(Users).filter(Users.name == student_name).first()
    if not student:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.student_id == student.id).first()
    if not lesson:
        db.close()
        raise HTTPException(status_code=404, detail="Lesson not found")

    lesson.completed = True
    db.commit()
    db.close()
    return {"detail": "Lesson marked as completed"}

@app.post("/api/upload/{bucket}")
async def upload_files(bucket: str, files: List[UploadFile] = File(...)):
    # Проверяем есть ли бакет, если нет — создаём
    found = minio_client.bucket_exists(bucket)
    if not found:
        minio_client.make_bucket(bucket)

    uploaded_files = []
    for file in files:
        try:
            content = await file.read()
            file_stream = io.BytesIO(content)
            minio_client.put_object(
                bucket,
                file.filename,
                data=file_stream,
                length=len(content),
                content_type=file.content_type
            )
            uploaded_files.append(file.filename)
        except S3Error as err:
            return {"error": str(err)}

    return {"uploaded": uploaded_files}