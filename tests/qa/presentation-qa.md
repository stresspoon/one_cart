# Presentation QA Sheet

- Scenario: 첫 로드 시 시드 주입 확인 (스토어가 없거나 undefined일 때 기본 데이터가 렌더링됨)
- Scenario: 전체선택 토글 on/off 시 체크 상태가 모든 카드에 반영됨
- Scenario: 개별선택 토글 시 합계/배송/총액이 즉시 갱신됨 (role="status" 읽힘)
- Scenario: 수량 +/– 클릭 및 직접 입력 시 즉시 합계/배송/총액 갱신, 최소 1로 정규화
- Scenario: 삭제 버튼 클릭 시 해당 카드 제거, 합계/배송/총액 갱신
- Scenario: 새로고침 후에도 선택/수량/삭제 상태가 유지됨 (localStorage 반영)

- Responsive: 360px에서 카드 영역이 "thumb" → "info" → "actions" 세로 스택
- Responsive: ≥768px(데스크톱)에서 카드 그리드가 "thumb info actions" 한 줄 배치
- Responsive: actions 영역은 grid-template-columns: auto auto 1fr auto로 버튼이 겹치지 않음
- Responsive: 수량 그룹은 inline-flex, 각 버튼 최소 40px, 입력 min-width 56px, 줄바꿈 방지
- Responsive: 요약 패널은 모바일 하단 블록, 데스크톱에서는 우측 스티키(top:16px)

- A11y: 모든 버튼/입력은 탭으로 포커스 가능
- A11y: 포커스 링는 outline:2px solid var(--accent), offset 2px로 시각적 구분
- A11y: 합계 영역은 role="status" aria-live="polite"로 스크린리더가 변화 읽음
- A11y: 이미지에 alt 제공, 체크박스/수량 컨트롤에 적절한 aria-label 적용

- Visual: 포인트 색(#ff3d00)이 버튼(위험/주요), 포커스, 가격 강조, 총액에 일관되게 반영
- Visual: 설명 텍스트는 2줄 클램프 유지(-webkit-line-clamp:2), 카드 높이 균일
- Visual: 버튼/아이콘이 그리드 및 min-width로 겹치거나 밀려나지 않음

