# schemas.py
# Pydantic 스키마: 클라이언트와 통신할 데이터 형식

from pydantic import BaseModel, EmailStr

class Resume(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        orm_mode = True

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class Contact(ContactCreate):
    id: int

    class Config:
        orm_mode = True
