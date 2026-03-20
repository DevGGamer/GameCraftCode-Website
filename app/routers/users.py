from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from minio.error import S3Error

from ..auth import hash_password, generate_random_password
from ..dependencies import get_db, require_role, minio_client
from ..schemas import (
    UserCreateDTO, UserResponseDTO,
    StudentDTO, StudentCourseDTO, ParentDTO, TeacherDTO, AdminDTO,
)
from ..models import Users, UserCourses, ParentStudent, TeacherInfo

router = APIRouter(prefix="/api", tags=["users"])


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
            id=user.id, name=user.name, surname=user.surname,
            email=user.email, phone=user.phone, role=user.role,
            parent_id=parent.parent_id if parent else None,
            courses=[
                StudentCourseDTO(
                    course_id=uc.course_id,
                    teacher_id=uc.teacher_id,
                    start_date=uc.start_date
                ) for uc in courses
            ]
        )

    if user.role == "parent":
        children = (
            db.query(ParentStudent.student_id)
            .filter(ParentStudent.parent_id == user.id)
            .all()
        )
        return ParentDTO(
            id=user.id, name=user.name, surname=user.surname,
            email=user.email, phone=user.phone, role=user.role,
            children=[c.student_id for c in children]
        )

    if user.role == "teacher":
        courses = (
            db.query(TeacherInfo.course_id)
            .filter(TeacherInfo.teacher_id == user.id)
            .all()
        )
        return TeacherDTO(
            id=user.id, name=user.name, surname=user.surname,
            email=user.email, phone=user.phone, role=user.role,
            courses=[c.course_id for c in courses]
        )

    return AdminDTO(
        id=user.id, name=user.name, surname=user.surname,
        email=user.email, phone=user.phone, role=user.role
    )


def delete_avatar(user_id: int) -> bool:
    object_name = f"{user_id}/avatar.png"
    try:
        minio_client.stat_object("users", object_name)
        minio_client.remove_object("users", object_name)
        return True
    except S3Error:
        return False


@router.get("/users", response_model=list[UserResponseDTO])
def get_users(_auth: dict = Depends(require_role("admin")), db: Session = Depends(get_db)):
    users = db.query(Users).all()
    return [build_user_dto(user, db) for user in users]


@router.get("/users/{user_id}", response_model=UserResponseDTO)
def get_user(
    user_id: int,
    _auth: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return build_user_dto(user, db)


@router.post("/users", response_model=UserResponseDTO)
def create_user(
    payload: UserCreateDTO,
    _auth: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    user = Users(
        login=payload.login,
        password=hash_password(payload.password),
        name=payload.name,
        surname=payload.surname,
        email=payload.email,
        phone=payload.phone,
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if payload.role == "student":
        if payload.parent_id:
            db.add(ParentStudent(parent_id=payload.parent_id, student_id=user.id))
        for c in payload.courses:
            db.add(UserCourses(
                student_id=user.id, teacher_id=c.teacher_id,
                course_id=c.course_id, start_date=c.start_date
            ))
    elif payload.role == "parent":
        for student_id in payload.children:
            db.add(ParentStudent(parent_id=user.id, student_id=student_id))
    elif payload.role == "teacher":
        for course_id in payload.courses:
            db.add(TeacherInfo(teacher_id=user.id, course_id=course_id))

    db.commit()
    return build_user_dto(user, db)


@router.put("/users/{user_id}", response_model=UserResponseDTO)
def update_user(
    user_id: int,
    payload: UserCreateDTO,
    _auth: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    old_role = user.role
    new_role = payload.role

    user.name = payload.name
    user.surname = payload.surname
    user.email = payload.email
    user.phone = payload.phone

    if payload.password and not payload.password.startswith("$argon2"):
        user.password = hash_password(payload.password)

    # Чистим связи по старой роли
    if old_role == "student":
        db.query(UserCourses).filter(UserCourses.student_id == user_id).delete(synchronize_session=False)
        db.query(ParentStudent).filter(ParentStudent.student_id == user_id).delete(synchronize_session=False)
    elif old_role == "parent":
        db.query(ParentStudent).filter(ParentStudent.parent_id == user_id).delete(synchronize_session=False)
    elif old_role == "teacher":
        db.query(TeacherInfo).filter(TeacherInfo.teacher_id == user_id).delete(synchronize_session=False)

    user.role = new_role

    # Создаём связи по новой роли
    if new_role == "student":
        if payload.parent_id:
            db.add(ParentStudent(parent_id=payload.parent_id, student_id=user_id))
        for c in payload.courses:
            db.add(UserCourses(
                student_id=user_id, teacher_id=c.teacher_id,
                course_id=c.course_id, start_date=c.start_date
            ))
    elif new_role == "parent":
        for student_id in payload.children:
            db.add(ParentStudent(parent_id=user_id, student_id=student_id))
    elif new_role == "teacher":
        for course_id in payload.courses:
            db.add(TeacherInfo(teacher_id=user_id, course_id=course_id))

    db.commit()
    db.refresh(user)
    return build_user_dto(user, db)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    _auth: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")

    db.query(ParentStudent).filter(
        (ParentStudent.parent_id == user_id) | (ParentStudent.student_id == user_id)
    ).delete(synchronize_session=False)

    db.query(UserCourses).filter(
        (UserCourses.student_id == user_id) | (UserCourses.teacher_id == user_id)
    ).delete(synchronize_session=False)

    db.query(TeacherInfo).filter(
        TeacherInfo.teacher_id == user_id
    ).delete(synchronize_session=False)

    delete_avatar(user.id)
    db.delete(user)
    db.commit()


@router.post("/users/{user_id}/reset-password")
def reset_user_password(
    user_id: int,
    _auth: dict = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    user = db.query(Users).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    new_password = generate_random_password()
    user.password = hash_password(new_password)
    db.commit()

    return {"new_password": new_password}


@router.get("/teachers")
def get_teachers(_auth: dict = Depends(require_role("admin")), db: Session = Depends(get_db)):
    teachers = db.query(Users).filter(Users.role == "teacher").all()
    return teachers
