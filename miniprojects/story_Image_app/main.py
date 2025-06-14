# A very simple FastAPI server

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pathlib import Path

app = FastAPI()

UPLOAD_FOLDER = Path("./uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

@app.post("/upload-story/")
async def upload_story(story: str = Form(...)):
    story_file = UPLOAD_FOLDER / "story.txt"
    story_file.write_text(story)
    return JSONResponse({"message": "Story uploaded successfully"})

@app.post("/upload-character/")
async def upload_character(file: UploadFile = File(...)):
    file_location = UPLOAD_FOLDER / file.filename
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return JSONResponse({"message": "Character image uploaded successfully"})
