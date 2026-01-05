from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, default="student")
    phone = Column(String)
    birth_date = Column(Date)

    level = Column(Integer, default=1)
    coins = Column(Integer, default=0)
    balance = Column(Integer, default=0)
    created_at = Column(Date)

    # relationships
    achievements = relationship("UserAchievement", back_populates="user")
    activities = relationship("UserActivity", back_populates="user")


class Courses(Base):
    __tablename__ = "user_courses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    course_name = Column(String, nullable=False)
    completed_lessons = Column(JSONB, default=dict)
    start_date = Column(Date)

    student = relationship("Users", foreign_keys=[student_id])
    teacher = relationship("Users", foreign_keys=[teacher_id])


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Users", back_populates="achievements")

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )

class UserActivity(Base):
    __tablename__ = "user_activity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_date = Column(Date, nullable=False)

    user = relationship("Users", back_populates="activities")

    __table_args__ = (
        UniqueConstraint("user_id", "activity_date", name="uq_user_activity_day"),
    )