from fastapi.security import APIKeyHeader
from fastapi import HTTPException, status, Security
from datetime import datetime, timedelta
from jose import jwt, JWTError
from dotenv import load_dotenv
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import os
import secrets
import string

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_IN_HOURS = 24

ph = PasswordHasher()

authorization_scheme = APIKeyHeader(name="Authorization", auto_error=False)

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False

def generate_random_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_token(user: dict) -> str:
    """
    Создание JWT с информацией о пользователе в payload
    """
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRES_IN_HOURS)
    payload = {
        "id": user["id"],
        "role": user["role"],
        "login": user.get("login"),
        "exp": expire
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
