from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, UniqueConstraint, func, text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    email = Column(String)
    role = Column(String, default="student", server_default=text("'student'"))
    phone = Column(String)
    birth_date = Column(Date)

    level = Column(Integer, default=1, server_default=text("1"))
    coins = Column(Integer, default=0, server_default=text("0"))
    balance = Column(Integer, default=0, server_default=text("0"))
    created_at = Column(Date, default=datetime.utcnow, server_default=func.current_date())

    # relationships
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")


class UserCourses(Base):
    __tablename__ = "user_courses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    completed_lessons = Column(Integer, default=0, server_default=text("0"))
    block_number = Column(Integer, default=1, server_default=text("1"))

    student = relationship("Users", foreign_keys=[student_id])
    teacher = relationship("Users", foreign_keys=[teacher_id])


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.current_date())

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

class ParentStudent(Base):
    __tablename__ = "parent_student_relationships"

    parent_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), primary_key=True)


class TeacherInfo(Base):
    __tablename__ = "teacher_info"

    teacher_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    course_id = Column(String, primary_key=True)