# backend/app/main.py
# FastAPI 진입점 및 API 라우터 정의

from fastapi import FastAPI, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from . import models, schemas, crud, database

import shutil
import os
from dotenv import load_dotenv  # .env 파일을 로드하기 위한 모듈

# ✅ .env 파일 로딩
load_dotenv()

# ✅ 프론트엔드 주소 (기본값 fallback)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# FastAPI 앱 초기화
app = FastAPI()

# ✅ CORS 설정 (프론트엔드에서 API 요청 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ SQLAlchemy 테이블 자동 생성
models.Base.metadata.create_all(bind=database.engine)

# ✅ 이력서 데이터 반환 (React의 Resume.jsx에서 fetch)
@app.get("/resume", response_model=list[schemas.Resume])
def read_resume(db: Session = Depends(database.get_db)):
    return crud.get_resume(db)  # DB에서 resume 리스트 가져옴

# ✅ 연락처 메시지 전송 (React의 ContactForm.jsx)
@app.post("/contact", response_model=schemas.Contact)
def submit_contact(form: schemas.ContactCreate, db: Session = Depends(database.get_db)):
    return crud.create_contact(db, form)  # 연락처 정보를 DB에 저장

# ✅ 파일 업로드 처리 (React의 Projects.jsx에서 fetch)
@app.post("/upload_file")
def upload_file(file: UploadFile = File(...)):
    # 업로드 경로 정의
    upload_dir = "app/uploads"
    os.makedirs(upload_dir, exist_ok=True)  # 디렉토리 없으면 생성
    file_location = f"{upload_dir}/{file.filename}"

    # 파일 저장
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return JSONResponse(content={
        "filename": file.filename,
        "url": f"/uploads/{file.filename}"  # 나중에 파일 접근 경로로 사용 가능
    })
