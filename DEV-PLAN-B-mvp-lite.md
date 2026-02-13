# Engineering Plan Lite: B안 30분 데모

- 기준: `PRD-B-mvp-v3.0.md`
- 목적: 단일 페이지 데모 구현

## 1) 구현 파일
1. `index.html`
2. `style.css`
3. `main.js`

## 2) 상태 모델
- `idle`: 시작 화면
- `playing`: 게임 진행
- `ended`: 결과 화면

## 3) 함수 계약
1. `showScreen(name)`
2. `startGame()`
3. `tickTimer()`
4. `handleTap()`
5. `endGame()`
6. `shareResult()`
7. `playTapSound()`
8. `updateBurstState()`

## 4) 로직 규칙
1. 시작 시 `score=0`, `combo=0`, `timeLeft=15`
2. 탭당 `score += 1`, `combo += 1`
3. 1초 간격 타이머 감소
4. `timeLeft===0`이면 종료
5. `bestScore`는 localStorage에 저장/로드
6. 콤보 구간(예: 10/20/30)마다 버튼 버스트 클래스 갱신
7. 탭 사운드 on/off 토글 지원(WebAudio or fallback)

## 5) 테스트 체크리스트
1. 시작->게임 전환
2. 탭 점수 증가
3. 15초 종료 자동 전환
4. 공유 복사 성공/실패 안내
5. 재시작 동작
6. 사운드 토글 동작
7. 콤보 구간별 버스트 UI 반영
