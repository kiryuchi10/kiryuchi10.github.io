from sqlmodel import create_engine, Session

# In production override via env var e.g. postgresql+psycopg2://user:pass@host/db
DATABASE_URL = "postgresql+psycopg2://gpsapp:gpsapp@db:5432/gpsapp"
engine = create_engine(DATABASE_URL, echo=False)

# Dependency
def get_session():
    with Session(engine) as session:
        yield session
