# crud.py
# 데이터베이스에서 이력서를 가져오는 함수

def get_resume(db: Session):
    return db.query(models.Resume).all()
