from fastapi import FastAPI, Depends, Request, HTTPException, File, UploadFile, Header, status, Path, Form
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, Base, engine
from .auth import generate_token, verify_token
from datetime import datetime, timedelta, date
from .models import Users, UserCourses, UserAchievement, UserActivity, ParentStudent, TeacherInfo
from sqlalchemy.orm import Session
from sqlalchemy import text
from minio.error import S3Error
from pydantic import BaseModel
from typing import Literal, Optional, Union
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

class UserBaseDTO(BaseModel):
    id: int
    name: str
    surname: str
    email: str | None
    phone: str | None
    role: str

class StudentCourseDTO(BaseModel):
    course_id: str
    teacher_id: int
    start_date: date

class StudentDTO(UserBaseDTO):
    parent_id: int | None
    courses: list[StudentCourseDTO]

class ParentDTO(UserBaseDTO):
    children: list[int]  # student ids

class TeacherDTO(UserBaseDTO):
    role: Literal["teacher"]
    courses: list[str] # course ids

class AdminDTO(UserBaseDTO):
    pass

UserResponseDTO = Union[
    StudentDTO,
    ParentDTO,
    TeacherDTO,
    AdminDTO
]



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

class UserBaseIn(BaseModel):
    login: str
    password: str
    name: str
    surname: str
    email: str
    phone: str
    role: Literal["admin", "student", "teacher", "parent"]

class StudentCourseIn(BaseModel):
    course_id: str
    teacher_id: int
    start_date: date

class StudentIn(UserBaseIn):
    role: Literal["student"]
    parent_id: int | None = None
    courses: list[StudentCourseIn] = []

class ParentIn(UserBaseIn):
    role: Literal["parent"]
    children: list[int] = []

class TeacherIn(UserBaseIn):
    role: Literal["teacher"]
    courses: list[str] = []

class AdminIn(UserBaseIn):
    role: Literal["admin"]

UserCreateDTO = Union[
    StudentIn,
    ParentIn,
    TeacherIn,
    AdminIn
]

@app.post("/api/users", response_model=UserResponseDTO)
def create_user(
    payload: UserCreateDTO,
    db: Session = Depends(get_db)
):
    user = Users(
        login=payload.login,
        password = payload.password,
        name=payload.name,
        surname=payload.surname,
        email=payload.email,
        phone=payload.phone,
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # STUDENT
    if payload.role == "student":
        if payload.parent_id:
            db.add(ParentStudent(
                parent_id=payload.parent_id,
                student_id=user.id
            ))

        for c in payload.courses:
            db.add(UserCourses(
                student_id=user.id,
                teacher_id=c.teacher_id,
                course_id=c.course_id,
                start_date = c.start_date
            ))

    # PARENT
    elif payload.role == "parent":
        for student_id in payload.children:
            db.add(ParentStudent(
                parent_id=user.id,
                student_id=student_id
            ))

    # TEACHER
    elif payload.role == "teacher":
        for course_id in payload.courses:
            db.add(TeacherInfo(
                teacher_id=user.id,
                course_id=course_id
            ))

    db.commit()

    return build_user_dto(user, db)

@app.put("/api/users/{user_id}", response_model=UserResponseDTO)
def update_user(
    user_id: int,
    payload: UserCreateDTO,
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    old_role = user.role
    new_role = payload.role

    # обновляем базовые поля
    user.name = payload.name
    user.surname = payload.surname
    user.email = payload.email
    user.phone = payload.phone

    # 🧹 чистим связи ПО СТАРОЙ РОЛИ
    if old_role == "student":
        db.query(UserCourses).filter(
            UserCourses.student_id == user_id
        ).delete(synchronize_session=False)

        db.query(ParentStudent).filter(
            ParentStudent.student_id == user_id
        ).delete(synchronize_session=False)

    elif old_role == "parent":
        db.query(ParentStudent).filter(
            ParentStudent.parent_id == user_id
        ).delete(synchronize_session=False)

    elif old_role == "teacher":
        db.query(TeacherInfo).filter(
            TeacherInfo.teacher_id == user_id
        ).delete(synchronize_session=False)

    # 🔁 меняем роль
    user.role = new_role

    # 🧩 создаём связи ПО НОВОЙ РОЛИ
    if new_role == "student":
        if payload.parent_id:
            db.add(ParentStudent(
                parent_id=payload.parent_id,
                student_id=user_id
            ))

        for c in payload.courses:
            db.add(UserCourses(
                student_id=user_id,
                teacher_id=c.teacher_id,
                course_id=c.course_id,
                start_date = c.start_date
            ))

    elif new_role == "parent":
        for student_id in payload.children:
            db.add(ParentStudent(
                parent_id=user_id,
                student_id=student_id
            ))

    elif new_role == "teacher":
        for course_id in payload.courses:
            db.add(TeacherInfo(
                teacher_id=user_id,
                course_id=course_id
            ))

    db.commit()
    db.refresh(user)

    return build_user_dto(user, db)

@app.delete("/api/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    # удаляем связи
    db.query(ParentStudent).filter(
        (ParentStudent.parent_id == user_id) |
        (ParentStudent.student_id == user_id)
    ).delete(synchronize_session=False)

    db.query(UserCourses).filter(
        (UserCourses.student_id == user_id) |
        (UserCourses.teacher_id == user_id)
    ).delete(synchronize_session=False)

    db.query(TeacherInfo).filter(
        TeacherInfo.teacher_id == user_id
    ).delete(synchronize_session=False)

    delete_avatar(user.id)

    db.delete(user)
    db.commit()

def delete_avatar(user_id: int) -> bool:
    object_name = f"{user_id}/avatar.png"

    try:
        minio_client.stat_object("users", object_name)
        minio_client.remove_object("users", object_name)
        return True
    except S3Error:
        return False

@app.get("/api/users", response_model=list[UserResponseDTO])
def get_users(payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    users = db.query(Users).all()
    return [build_user_dto(user, db) for user in users]

@app.get("/api/users/{user_id}", response_model=UserResponseDTO)
def get_user(
    user_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    return get_user_by_id(user_id, db)

def build_user_dto(user: Users, db: Session) -> UserResponseDTO:
    if user.role == "student":
        parent = (
            db.query(ParentStudent.parent_id)
            .filter(ParentStudent.student_id == user.id)
            .first()
        )

        courses = (
            db.query(UserCourses)
            .filter(UserCourses.student_id == user.id)
            .all()
        )

        return StudentDTO(
            id=user.id,
            name=user.name,
            surname=user.surname,
            email=user.email,
            phone=user.phone,
            role=user.role,
            parent_id=parent.parent_id if parent else None,
            courses=[
                StudentCourseDTO(
                    course_id=uc.course_id,
                    teacher_id=uc.teacher_id,
                    start_date=uc.start_date
                )
                for uc in courses
            ]
        )

    if user.role == "parent":
        children = (
            db.query(ParentStudent.student_id)
            .filter(ParentStudent.parent_id == user.id)
            .all()
        )

        return ParentDTO(
            id=user.id,
            name=user.name,
            surname=user.surname,
            email=user.email,
            phone=user.phone,
            role=user.role,
            children=[c.student_id for c in children]
        )

    if user.role == "teacher":
        courses = (
            db.query(TeacherInfo.course_id)
            .filter(TeacherInfo.teacher_id == user.id)
            .all()
        )

        return TeacherDTO(
            id=user.id,
            name=user.name,
            surname=user.surname,
            email=user.email,
            phone=user.phone,
            role=user.role,
            courses=[c.course_id for c in courses]
        )

    return AdminDTO(
        id=user.id,
        name=user.name,
        surname=user.surname,
        email=user.email,
        phone=user.phone,
        role=user.role
    )

def get_user_by_id(user_id: int, db: Session) -> UserResponseDTO:
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return build_user_dto(user, db)

@app.get("/api/teachers")
def get_users(db: Session = Depends(get_db)):
    teachers = db.query(Users).filter(Users.role == "teacher").all()
    return teachers

@app.get("/api/courses")
def get_courses(payload: dict = Depends(verify_token)):
    courses = []

    for obj in minio_client.list_objects("courses", recursive=False):
        file_data = minio_client.get_object(
            "courses",
            f"{obj.object_name}passport.json"
        )
        data = json.loads(file_data.read())
        file_data.close()
        file_data.release_conn()

        courses.append({
            "id": obj.object_name,
            "name": data[0]["name"],
            "description": data[0]["description"],
        })

    return courses

@app.get("/api/user_course/")
@app.get("/api/user_course/{student_id}")
def get_courses(student_id: Optional[int] = None, payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    if (student_id is None):
        student_id = payload["id"]
    cours=[]
    courses = db.query(UserCourses).filter(UserCourses.student_id == student_id).all()

    for course in courses:
        teacher = db.query(Users).filter(Users.id == course.teacher_id).first()
        avatar_t = get_avatar_url(teacher.id)
        file_data = minio_client.get_object("courses", f"{course.course_id}passport.json")
        data = json.loads(file_data.read().decode("utf-8"))
        file_data.close()
        file_data.release_conn()
        data2 = data[1]
        k=0
        com=0
        for i, module in enumerate(data2.get("modules", [])):
            prefix = f"{course.course_id}Module{module['id']}/"
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
             "totalLessons": k, "progress": progr, "isActive": active, "name": course.course_id, "startDate": course.start_date,
             "instructor": { "surname": teacher.surname, "name": teacher.name, "title": "Senior Python Developer", "avatar": avatar_t }, 
             "modules": data2["modules"]}
        cours.append(c)

    return cours

@app.get("/api/add_user_course_and_teacher/{student_id}/{course_name}/{block_number}/{teacher_id}")
def get_courses(student_id: int, course_name: str, block_number: int, teacher_id: str, payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    db: Session = SessionLocal()

    user = UserCourses(
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