# backend/app/test_db.py
import asyncio
from .config import database

async def check():
    try:
        await database.connect()
        # Try a trivial query
        val = await database.fetch_val("SELECT 1")
        print("✅ MySQL responded with:", val)
    except Exception as e:
        print("❌ DB connection failed:", repr(e))
    finally:
        await database.disconnect()

if __name__ == "__main__":
    asyncio.run(check())
