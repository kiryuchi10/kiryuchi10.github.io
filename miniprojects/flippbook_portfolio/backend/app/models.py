# models.py
# SQLAlchemy 모델 정의

from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Resume(Base):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    content = Column(Text)

class Contact(Base):
    __tablename__ = "contact"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(255))
    message = Column(Text)
