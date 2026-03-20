from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta, date
from minio.error import S3Error
import io

from ..auth import verify_token
from ..dependencies import get_db, minio_client
from ..models import Users, UserAchievement, UserActivity

router = APIRouter(prefix="/api", tags=["profile"])


def get_avatar_url(user_id: int) -> str | None:
    object_name = f"{user_id}/avatar.png"
    try:
        minio_client.stat_object("users", object_name)
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
        db.add(UserActivity(user_id=user_id, activity_date=today))
        db.commit()


@router.get("/profile")
def get_user_profile(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = db.query(Users).filter(Users.id == payload["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    track_activity(user.id, db)

    achievements = (
        db.query(UserAchievement)
        .filter(UserAchievement.user_id == user.id)
        .count()
    )
    streak = get_streak(user.id, db)
    avatar = get_avatar_url(user.id)

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "phone": user.phone,
            "birthDate": user.birth_date,
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


@router.put("/profile")
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
