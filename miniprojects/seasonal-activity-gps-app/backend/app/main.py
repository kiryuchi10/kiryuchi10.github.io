from datetime import datetime
from typing import List

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from sqlmodel import Session, SQLModel, select

from .database import engine, get_session
from .models import Activity
from .utils import current_season

app = FastAPI(title="Seasonal Activity GPS API")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

class ActivityOut(BaseModel):
    id: int
    name: str
    lat: float
    lon: float
    description: str | None = None
    seasons: List[str]

    class Config:
        orm_mode = True

@app.get("/activities/", response_model=List[ActivityOut])
def list_activities(
    lat: float,
    lon: float,
    radius_km: float = 25,
    limit: int = 50,
    session: Session = Depends(get_session),
):
    season = current_season(lat, datetime.utcnow())
    stmt = (
        select(Activity)
        .where(season.in_(Activity.seasons))  # simple season filter
        .limit(limit)
    )
    return session.exec(stmt).all()

@app.get("/")
def root():
    return {"status": "ok"}
