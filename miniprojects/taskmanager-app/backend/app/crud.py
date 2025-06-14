# backend/app/crud.py
from sqlalchemy import select
from .models import Task

async def create_task(db, task_create):
    query = Task.__table__.insert().values(**task_create.dict())
    task_id = await db.execute(query)
    return {**task_create.dict(), "id": task_id, "completed": False}

async def list_tasks(db):
    query = select(Task)
    return await db.fetch_all(query)

async def update_task(db, task_id: int, completed: bool):
    query = Task.__table__.update().where(Task.id==task_id).values(completed=completed)
    await db.execute(query)
    return {"id": task_id, "completed": completed}
