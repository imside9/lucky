# TASKS: B안 MVP 실행 티켓

- 기준 문서: `PRD-B-mvp-v2.0.md`
- 작성일: 2026-02-13
- 목적: 디자이너/개발자 병렬 실행과 Merge Gate 통과를 위한 작업 단위 정의

## 0) 운영 규칙

1. 우선순위: P0 > P1 > P2
2. 상태: TODO / DOING / REVIEW / DONE
3. 완료 정의(DoD): 티켓별 Acceptance Criteria 100% 충족
4. 범위 통제: 본 문서 외 신규 기능은 백로그로 이동

## 1) 디자이너 티켓 (D-Track)

### D-01 [P0] Feed 화면 구조/레이아웃 스펙
- 목표: Feed 화면의 정보 위계와 모바일 레이아웃 확정
- 산출물: `docs/design/feed-spec.md`
- 작업:
  1. Top topic header 구성
  2. 작성 CTA 위치(sticky 여부 포함)
  3. post card 리스트 밀도 규칙
- Acceptance Criteria:
  1. 360px/390px 기준 레이아웃 모두 정의
  2. loading/empty/ready/error 상태별 UI 포함
  3. 개발 구현 가능한 selector/블록 단위 지시 포함

### D-02 [P0] Composer Modal 상세 스펙
- 목표: 30초 내 첫 게시 UX 보장
- 산출물: `docs/design/composer-spec.md`
- 작업:
  1. 텍스트 입력(120자 제한) 인터랙션
  2. 스티커 선택 UI(8~12개 preset)
  3. validation/error/success 상태
- Acceptance Criteria:
  1. 버튼 활성/비활성 조건 명시
  2. 금칙어 실패 inline 에러 문구 정의
  3. submit-loading/success/error 상태 정의

### D-03 [P0] Report Modal 및 신고 UX 스펙
- 목표: 2단계 이내 신고 완료 UX 확정
- 산출물: `docs/design/report-spec.md`
- 작업:
  1. 사유 선택 라디오 그룹
  2. 상세 입력(선택)
  3. 제출 완료 피드백
- Acceptance Criteria:
  1. 신고 완료 후 토스트/모달 종료 흐름 명시
  2. 잘못된 입력/네트워크 실패 상태 처리 정의

### D-04 [P1] Token Spec 작성
- 목표: 구현 일관성을 위한 디자인 토큰 확정
- 산출물: `docs/design/token-spec.md`
- 작업:
  1. 색상/타이포/간격/라운드/그림자/모션 토큰
  2. 상태 컬러(success/warning/error/info)
- Acceptance Criteria:
  1. CSS 변수로 바로 옮길 수 있는 형식
  2. 대비 기준(AA 근사) 확인 값 포함

### D-05 [P1] 접근성 체크리스트
- 목표: MVP 접근성 최소 기준 충족
- 산출물: `docs/design/a11y-checklist.md`
- 작업:
  1. 터치 타깃(44px)
  2. 포커스 링
  3. 모달 포커스 트랩
  4. 오류 메시지 가독성
- Acceptance Criteria:
  1. 화면별 점검 항목이 체크리스트로 제공
  2. QA 단계에서 바로 사용 가능

## 2) 개발 티켓 (E-Track)

### E-01 [P0] 프로젝트 스캐폴딩 (Cloudflare)
- 목표: 구현 가능한 기본 골격 생성
- 산출물:
  1. `b-mvp/web/*`
  2. `b-mvp/worker/*`
  3. `b-mvp/worker/migrations/*`
- 작업:
  1. Pages + Workers 구조 생성
  2. 환경 변수 키 목록 정의
- Acceptance Criteria:
  1. 로컬/스테이지 빌드 가능
  2. 기본 health endpoint 동작

### E-02 [P0] D1 스키마 및 마이그레이션
- 목표: posts/reactions/reports/sessions 테이블 확정
- 산출물: `b-mvp/worker/migrations/001_init.sql`
- 작업:
  1. 테이블 생성
  2. 인덱스/unique 제약 추가
- Acceptance Criteria:
  1. PRD 2.0 스키마와 100% 일치
  2. migration 재실행 안전성 확인

### E-03 [P0] Session + Feed API 구현
- 목표: 기본 읽기 루프 구성
- 산출물: `b-mvp/worker/src/routes/session.ts`, `feed.ts`
- 작업:
  1. `POST /api/session/init`
  2. `GET /api/feed`
- Acceptance Criteria:
  1. active 게시물만 노출
  2. cursor 기반 페이지네이션 동작

### E-04 [P0] Post API + 금칙어 필터
- 목표: 게시 생성과 1차 안전장치 구현
- 산출물: `b-mvp/worker/src/routes/posts.ts`, `moderation.ts`
- 작업:
  1. 입력 검증(text<=120, sticker whitelist)
  2. 금칙어 필터
  3. post insert
- Acceptance Criteria:
  1. 금칙어 위반 시 400 응답
  2. 성공 시 post_id/created_at 반환

### E-05 [P0] Reaction API + 중복 제한
- 목표: 반응 루프 완성
- 산출물: `b-mvp/worker/src/routes/reactions.ts`
- 작업:
  1. reaction_type 검증
  2. unique 제약 기반 중복 차단
- Acceptance Criteria:
  1. 중복 반응은 409 반환
  2. 정상 반응 시 카운트 반영 가능 데이터 저장

### E-06 [P0] Report API + 자동 숨김
- 목표: 신고 정책 구현
- 산출물: `b-mvp/worker/src/routes/reports.ts`
- 작업:
  1. 신고 생성
  2. post별 누적 신고 수 계산
  3. 임계치(3) 도달 시 post hidden 처리
- Acceptance Criteria:
  1. 3회 누적 시 hidden 전환
  2. report 상태 queued로 저장

### E-07 [P1] 관리자 신고 조회/처리 API
- 목표: 최소 운영 기능 제공
- 산출물: `b-mvp/worker/src/routes/admin.ts`
- 작업:
  1. `GET /api/admin/reports`
  2. `POST /api/admin/posts/:id/status`
- Acceptance Criteria:
  1. x-admin-token 검증
  2. active/blocked 상태 변경 가능

### E-08 [P1] Rate Limit 구현
- 목표: 세션 기반 요청 제한
- 산출물: `b-mvp/worker/src/security/rate-limit.ts`
- 작업:
  1. 분 단위 버킷 제한
  2. posts/reactions/reports 경로 적용
- Acceptance Criteria:
  1. 한도 초과 시 429 반환
  2. 정상 요청은 영향 없음

### E-09 [P0] 프론트 UI 연동 (Feed/Composer/Report)
- 목표: 핵심 사용자 흐름 E2E 연결
- 산출물: `b-mvp/web/index.html`, `style.css`, `main.js`
- 작업:
  1. feed 렌더링
  2. composer submit
  3. reaction submit
  4. report submit
- Acceptance Criteria:
  1. session->post->feed 노출 동작
  2. reaction/report 동작 및 피드백 표시

### E-10 [P1] 로깅/에러 표준화
- 목표: 운영/디버깅 가능성 확보
- 산출물: `b-mvp/worker/src/lib/errors.ts`, `metrics.ts`
- 작업:
  1. 에러 코드 매핑
  2. 이벤트 로깅 포인트 삽입
- Acceptance Criteria:
  1. 400/401/403/409/429/500 표준 응답
  2. 주요 이벤트 3종 로그 기록

### E-11 [P1] 테스트 작성 및 실행
- 목표: 핵심 회귀 방지
- 산출물: `b-mvp/worker/tests/*`, `b-mvp/web/tests/*`(선택)
- 작업:
  1. validation 단위 테스트
  2. 신고 임계치 통합 테스트
  3. 반응 중복 테스트
- Acceptance Criteria:
  1. 필수 테스트 전부 통과
  2. 실패 케이스 로그 확인 가능

## 3) 공통 Merge Gate 티켓

### M-01 [P0] 디자인-개발 계약 일치 검증
- 목표: 상태/컴포넌트 불일치 제거
- 산출물: `docs/merge/design-dev-contract-check.md`
- Acceptance Criteria:
  1. Feed/Composer/Report 상태 매핑 완료
  2. 누락 상태 0건

### M-02 [P0] 필수 E2E 통과
- 목표: 릴리스 최소 기능 검증
- 체크:
  1. session -> post -> feed
  2. reaction 중복 차단(409)
  3. report 3회 -> hidden
- Acceptance Criteria:
  1. 3개 시나리오 전부 통과 증빙 첨부

### M-03 [P0] Go/No-Go 리뷰
- 목표: 릴리스 의사결정
- 산출물: `docs/release/go-no-go.md`
- Acceptance Criteria:
  1. 치명 버그 0
  2. No-Go 항목 미충족 없음

## 4) 일정 매핑 (5일)

- Day 1
  - D-01, D-02 시작
  - E-01, E-02, E-03 시작

- Day 2
  - D-03, D-04
  - E-04, E-05

- Day 3
  - D-05, 디자인 리뷰
  - E-06, E-09

- Day 4
  - 디자인 수정 반영
  - E-07, E-08, E-10, E-11

- Day 5
  - M-01, M-02, M-03
  - 스테이지 배포 및 최종 리뷰

## 5) 오너 제안

- 디자인 오너: D-01~D-05
- 개발 오너: E-01~E-11
- PM/기획 오너: M-01~M-03 승인 및 범위 통제
