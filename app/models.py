from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from .database import Base

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True)
    password = Column(String)
    name = Column(String)
    surname = Column(String)
    email = Column(String, unique=True)
    role = Column(String, default="student")
    phone = Column(String)
    birth_date = Column(Date)

class Courses(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_name = Column(String)
    completed_lessons = Column(Integer)
    block_number = Column(Integer)
    teacher_id = Column(Integer, ForeignKey("users.id"))