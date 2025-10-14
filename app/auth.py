from fastapi.security import APIKeyHeader
from fastapi import HTTPException, status, Security
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_IN_HOURS = 24

authorization_scheme = APIKeyHeader(name="Authorization", auto_error=False)

def generate_token(user: dict) -> str:
    """
    Создание JWT с информацией о пользователе в payload
    """
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRES_IN_HOURS)
    payload = {
        "id": user["id"],
        "role": user["role"],
        "login": user.get("login")
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def verify_token(
        authorization_header: str = Security(authorization_scheme),
        ) -> str:
    if authorization_header is None:
        raise HTTPException(status_code=401, detail="Token missing")
    if "Bearer " not in authorization_header:
        raise HTTPException(status_code=401, detail="Invalid token format")
    clear_token = authorization_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(clear_token, JWT_SECRET, algorithms="HS256")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Expired token")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
