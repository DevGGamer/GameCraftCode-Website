from fastapi import APIRouter, Depends, HTTPException

from ..auth import verify_token
from ..dependencies import minio_client
from ..database import SessionLocal
from ..models import Users

router = APIRouter(prefix="/api", tags=["lessons"])


@router.post("/lessons/{student_name}/{lesson_id}/start")
def start_lesson(student_name: str, lesson_id: int, _auth: dict = Depends(verify_token)):
    db = SessionLocal()
    student = db.query(Users).filter(Users.name == student_name).first()
    if not student:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.student_id == student.id).first()
    if not lesson:
        db.close()
        raise HTTPException(status_code=404, detail="Lesson not found")

    url = minio_client.presigned_get_object(student.course, lesson.video_name)
    db.close()
    return {"video_url": url}


@router.post("/lessons/{student_name}/{lesson_id}/complete")
def complete_lesson(student_name: str, lesson_id: int, _auth: dict = Depends(verify_token)):
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
