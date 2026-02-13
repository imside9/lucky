# Design Plan Lite: B안 30분 데모

- 기준: `PRD-B-mvp-v3.0.md`
- 목적: 빠른 구현을 위한 최소 UI 설계 기준

## 1) 디자인 원칙
1. 한 화면 한 행동
2. 정보 밀도 최소화
3. 즉시 피드백(점수/타이머/버튼 상태)

## 2) 화면 설계
- Start
  - 타이틀
  - 1문장 설명
  - Primary CTA `게임 시작`
- Game
  - 상단 타이머
  - 중앙 점수
  - 대형 탭 버튼
- Result
  - 이번 점수
  - 최고점
  - `결과 공유` / `다시 하기`

## 3) 컴포넌트
1. Card Container
2. Primary Button
3. Secondary Button
4. Status Message (복사 성공/실패)

## 4) 토큰 (초안)
- 색상: 배경 `#f6fbff`, 포인트 `#0ea5e9`, 보조 `#0f172a`, 성공 `#16a34a`
- 타이포: 제목 28px, 본문 16px, 점수 40px
- 간격: 8/12/16/24
- 라운드: 카드 20px, 버튼 14px

## 5) 상태
- Start: default
- Game: playing
- Result: ended
- Share message: hidden | success | error

## 6) 접근성
1. 버튼 높이 48px 이상
2. 포커스 링 유지
3. 대비 확보(AA 근사)
