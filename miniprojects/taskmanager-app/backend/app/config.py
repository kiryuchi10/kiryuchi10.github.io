# backend/app/config.py
import os
from databases import Database
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("MYSQL_USER")
DB_PASS = os.getenv("MYSQL_PASSWORD")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_NAME = os.getenv("MYSQL_DB")

# — Async URL for `databases` (aiomysql) —
ASYNC_DATABASE_URL = f"mysql+aiomysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

# — Sync URL for SQLAlchemy DDL (PyMySQL) —
SYNC_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

# used by your CRUD layer
database = Database(ASYNC_DATABASE_URL)

# used only for DDL (create_all)
engine = create_engine(SYNC_DATABASE_URL, echo=True)

# metadata and ORM session (if you need)
metadata = MetaData()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
