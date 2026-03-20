from pydantic import BaseModel
from typing import Literal, Optional, Union
from datetime import date
from fastapi import UploadFile


class LoginRequest(BaseModel):
    login: str
    password: str


class UserInfoRequest(BaseModel):
    name: str
    surname: str
    email: str | None
    phone: str | None
    birthDate: date | None
    avatar: UploadFile | None


class UserBaseDTO(BaseModel):
    id: int
    name: str
    surname: str
    email: str | None
    phone: str | None
    role: str


class StudentCourseDTO(BaseModel):
    course_id: str
    teacher_id: int
    start_date: date


class StudentDTO(UserBaseDTO):
    parent_id: int | None
    courses: list[StudentCourseDTO]


class ParentDTO(UserBaseDTO):
    children: list[int]


class TeacherDTO(UserBaseDTO):
    role: Literal["teacher"]
    courses: list[str]


class AdminDTO(UserBaseDTO):
    pass


UserResponseDTO = Union[StudentDTO, ParentDTO, TeacherDTO, AdminDTO]


class UserBaseIn(BaseModel):
    login: str
    password: str
    name: str
    surname: str
    email: str
    phone: str
    role: Literal["admin", "student", "teacher", "parent"]


class StudentCourseIn(BaseModel):
    course_id: str
    teacher_id: int
    start_date: date


class StudentIn(UserBaseIn):
    role: Literal["student"]
    parent_id: int | None = None
    courses: list[StudentCourseIn] = []


class ParentIn(UserBaseIn):
    role: Literal["parent"]
    children: list[int] = []


class TeacherIn(UserBaseIn):
    role: Literal["teacher"]
    courses: list[str] = []


class AdminIn(UserBaseIn):
    role: Literal["admin"]


UserCreateDTO = Union[StudentIn, ParentIn, TeacherIn, AdminIn]
