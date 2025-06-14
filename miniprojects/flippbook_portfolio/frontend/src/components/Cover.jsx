// Cover.jsx
// 묘비 형식의 책 커버 컴포넌트

import React from "react";
import "./Cover.css"; // 커스텀 스타일링 (선택사항)

const Cover = () => {
  return (
    <div className="cover">
      <h1>이동현</h1>
      <hr />
      <p>“코드는 사라져도, 논리는 영원하리.”</p>
      <p className="epitaph">– 마지막 커밋 메시지</p>
    </div>
  );
};

export default Cover;
