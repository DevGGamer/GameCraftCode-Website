from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import json

from ..auth import verify_token
from ..dependencies import get_db, minio_client
from ..database import SessionLocal
from ..models import Users, UserCourses
from .profile import get_avatar_url

router = APIRouter(prefix="/api", tags=["courses"])


@router.get("/courses")
def get_courses_list(payload: dict = Depends(verify_token)):
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


@router.get("/user_course/")
@router.get("/user_course/{student_id}")
def get_user_courses(
    student_id: Optional[int] = None,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    if student_id is None:
        student_id = payload["id"]

    cours = []
    courses = db.query(UserCourses).filter(UserCourses.student_id == student_id).all()

    for course in courses:
        teacher = db.query(Users).filter(Users.id == course.teacher_id).first()
        avatar_t = get_avatar_url(teacher.id)
        file_data = minio_client.get_object("courses", f"{course.course_id}passport.json")
        data = json.loads(file_data.read().decode("utf-8"))
        file_data.close()
        file_data.release_conn()
        data2 = data[1]
        k = 0
        com = 0
        for i, module in enumerate(data2.get("modules", [])):
            prefix = f"{course.course_id}Module{module['id']}/"
            objects = minio_client.list_objects("courses", prefix=prefix, recursive=True)
            l = 0
            for obj in objects:
                if obj.object_name.endswith((".mp4", ".MP4")):
                    k += 1
                    video_name = obj.object_name.split("/")[-1]
                    url = minio_client.presigned_get_object("courses", obj.object_name)
                    data2["modules"][i]["items"][int(video_name[1]) - 1]["video"] = url
                    if course.completed_lessons is not None:
                        if int(video_name[1]) in course.completed_lessons[i + 1]:
                            data2["modules"][i]["items"][int(video_name[1]) - 1]["completed"] = True
                            c += 1
                        else:
                            data2["modules"][i]["items"][int(video_name[1]) - 1]["completed"] = False
                    l += 1
            data2["modules"][i]["lessons"] = l
            data2["modules"][i]["completed"] = com
            if l == com:
                data2["modules"][i]["status"] = "completed"
            else:
                data2["modules"][i]["status"] = "in-progress"

        if course.completed_lessons is None:
            progr = 0
        else:
            progr = round(k / com * 100)

        active = progr != 100

        c = {
            "title": data[0]["title"], "level": data[0]["level"],
            "description": data[0]["description"], "duration": data[0]["duration"],
            "teacher_id": course.teacher_id, "completedLessons": com,
            "totalLessons": k, "progress": progr, "isActive": active,
            "name": course.course_id, "startDate": course.start_date,
            "instructor": {
                "surname": teacher.surname, "name": teacher.name,
                "title": "Senior Python Developer", "avatar": avatar_t
            },
            "modules": data2["modules"]
        }
        cours.append(c)

    return cours


@router.get("/add_user_course_and_teacher/{student_id}/{course_name}/{block_number}/{teacher_id}")
def add_user_course_and_teacher(
    student_id: int,
    course_name: str,
    block_number: int,
    teacher_id: str,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = UserCourses(
        student_id=student_id,
        completed_lessons=0,
        teacher_id=teacher_id,
        block_number=block_number,
        course_name=course_name.replace(">", "/"),
    )
    db.add(user)
    db.commit()

    return {"status": "ok"}
