# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import database, engine, metadata
from . import models, crud, schemas

# Create tables
metadata.create_all(engine)

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await database.connect()

@app.on_event("shutdown")
async def on_shutdown():
    await database.disconnect()

@app.post("/tasks/", response_model=schemas.TaskRead)
async def create_task(task: schemas.TaskCreate):
    return await crud.create_task(database, task)

@app.get("/tasks/", response_model=list[schemas.TaskRead])
async def read_tasks():
    return await crud.list_tasks(database)

@app.put("/tasks/{task_id}", response_model=schemas.TaskRead)
async def toggle_task(task_id: int, completed: bool):
    return await crud.update_task(database, task_id, completed)
