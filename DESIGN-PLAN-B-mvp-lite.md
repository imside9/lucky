# Design Plan Lite: B안 30분 데모

- 기준: `PRD-B-mvp-v3.0.md`
- 목적: 짧고 강한 도파민 UX를 위한 하이텐션 비주얼 설계 기준

## 1) 디자인 원칙
1. 한 화면 한 행동
2. 짧고 강한 피드백(사운드 + 모션 + 색 변화)
3. 키치하지만 읽기 쉬운 스타일(과감한 색, 과장된 버튼 반응)

## 2) 화면 설계
- Start
  - 타이틀
  - 1문장 설명
  - Primary CTA `게임 시작`
- Game
  - 상단 타이머
  - 중앙 점수
  - 콤보 텍스트
  - 대형 탭 버튼(점진적 버스트)
  - 사운드 토글
- Result
  - 이번 점수
  - 최고점
  - `결과 공유` / `다시 하기`

## 3) 컴포넌트
1. Card Container
2. Primary Button
3. Secondary Button
4. Status Message (복사 성공/실패)
5. Combo Badge
6. Burst Button Effect Layer
7. Sound Toggle Chip

## 4) 토큰 (초안)
- 색상: 배경 `#fff7ed`, 포인트 `#f97316`, 보조 `#1f2937`, 강조 `#ec4899`, 성공 `#22c55e`
- 타이포: 제목 30px, 본문 16px, 점수 44px, 콤보 18px
- 간격: 8/12/16/24
- 라운드: 카드 22px, 버튼 999px(캡슐), 배지 999px

## 5) 상태
- Start: default
- Game: playing
- Result: ended
- Share message: hidden | success | error
- Burst: calm | heated | explode

## 6) 접근성
1. 버튼 높이 48px 이상
2. 포커스 링 유지
3. 대비 확보(AA 근사)
4. 모션 감소 설정 선호 사용자 대상 `prefers-reduced-motion` 대응
