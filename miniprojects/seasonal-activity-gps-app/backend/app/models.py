from typing import List, Optional
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import ARRAY

class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    lat: float
    lon: float
    seasons: List[str] = Field(sa_column=Column(ARRAY(str)))
