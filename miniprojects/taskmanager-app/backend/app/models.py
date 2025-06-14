# backend/app/models.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from .config import metadata

Base = declarative_base(metadata=metadata)

class Task(Base):
    __tablename__ = "tasks"
    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    completed   = Column(Boolean, default=False)
