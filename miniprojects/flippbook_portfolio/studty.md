
---

## 📘 `study.md` (Python, React, JavaScript 개념 요약)

```markdown
# 📚 Study Notes for 이동현 포트폴리오

---

## 🐍 Python / FastAPI

- **FastAPI**: 경량 웹 프레임워크. `@app.get()` 데코레이터로 REST API 구성.
- **Pydantic**: 데이터 검증 및 JSON 직렬화용 클래스 (`BaseModel`)
- **SQLAlchemy**: ORM 도구. `create_engine`, `SessionLocal`, `Base`
- **.env**: 환경변수를 코드와 분리
- **Docker**: 배포 환경 일관화

---

## ⚛️ React.js

- **CRA (`npx create-react-app`)**: 초기 설정 자동화
- **JSX**: HTML과 JS가 혼합된 문법
- **Component 구조**: 함수형 컴포넌트 중심
- **useState / useEffect**: 상태관리 및 side effect
- **react-pageflip**: HTMLFlipBook으로 책 넘기기 구현

---

## 📜 JavaScript 주요 문법

- `useState([])`: 배열, 객체 등 상태 초기화
- `fetch`: API 호출 (`GET`, `POST`)
- `map()`: 배열 렌더링
- `onChange`, `onSubmit`: 폼 핸들링 이벤트
- `JSON.stringify() / JSON.parse()`: 데이터 직렬화

---

## 📂 전체 흐름 요약

프론트 → `/resume` API 요청 → FastAPI → DB → JSON 응답 → React가 렌더링  
파일 업로드 → `POST /upload_file` → FastAPI가 `uploads/` 폴더에 저장

---

