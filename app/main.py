import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic.config import Config
from alembic import command

from .routers import auth, profile, users, courses, lessons, upload

logger = logging.getLogger("alembic.runtime.migration")


def run_migrations():
    try:
        alembic_cfg = Config("app/alembic.ini")
        command.upgrade(alembic_cfg, "head")
    except Exception as e:
        logger.warning(f"Alembic migration skipped: {e}")


run_migrations()

app = FastAPI()

cors_origins_env = os.getenv("CORS_ORIGINS", "*")
if cors_origins_env.strip() == "*":
    allow_origins = ["*"]
else:
    allow_origins = [origin.strip() for origin in cors_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(upload.router)
