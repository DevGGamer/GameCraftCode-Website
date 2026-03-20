from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..auth import generate_token, verify_token, verify_password, hash_password
from ..dependencies import get_db
from ..schemas import LoginRequest
from ..models import Users

router = APIRouter(prefix="/api", tags=["auth"])

# Простейший rate limiter
login_attempts = {}


@router.get("/protected", name="Проверка авторизации")
async def protected(payload: dict = Depends(verify_token)):
    return {"message": "OK", "role": payload["role"]}


@router.post("/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    login = data.login
    password = data.password

    if not isinstance(login, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Неверные данные")

    client_ip = request.client.host
    attempts = login_attempts.get(client_ip, {"count": 0, "time": datetime.utcnow()})
    if attempts["count"] >= 10 and (datetime.utcnow() - attempts["time"]).seconds < 600:
        raise HTTPException(status_code=429, detail="Слишком много попыток входа. Повторите позже.")

    user = db.query(Users).filter(Users.login == login).first()

    password_valid = False
    if user:
        if user.password.startswith("$argon2"):
            password_valid = verify_password(password, user.password)
        else:
            if password == user.password:
                user.password = hash_password(password)
                db.commit()
                password_valid = True

    if not user or not password_valid:
        attempts["count"] += 1
        attempts["time"] = datetime.utcnow()
        login_attempts[client_ip] = attempts
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    login_attempts[client_ip] = {"count": 0, "time": datetime.utcnow()}

    token = generate_token({"id": user.id, "login": user.login, "role": user.role})
    return {"message": "Успешный вход", "token": token, "user": {"id": user.id, "name": user.name}}
