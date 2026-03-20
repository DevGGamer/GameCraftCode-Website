from fastapi import Depends, Header, HTTPException, status
from typing import Optional
from sqlalchemy.orm import Session
from minio import Minio
import os

from .database import SessionLocal
from .auth import verify_token


def get_token_from_header(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется токен"
        )
    return authorization.split(" ")[1]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def require_role(*allowed_roles: str):
    def dependency(payload: dict = Depends(verify_token)):
        if payload["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Недостаточно прав")
        return payload
    return dependency


MINIO_PUBLIC_URL = os.getenv("MINIO_ENDPOINT", "localhost:4000")

minio_client = Minio(
    MINIO_PUBLIC_URL,
    access_key=os.getenv("MINIO_ACCESS_KEY", "admin"),
    secret_key=os.getenv("MINIO_SECRET_KEY", "adminpas"),
    secure=False
)
