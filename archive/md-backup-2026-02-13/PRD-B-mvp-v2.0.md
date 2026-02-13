# PRD 2.0: B안 MVP - 10대 익명 밈/리액션 웹앱

- 버전: v2.0
- 작성일: 2026-02-13
- 기반 문서:
  - `PRD-B-mvp.md`
  - `DESIGN-PLAN-B-mvp.md`
  - `DEV-PLAN-B-mvp.md`
- 목적: 기획/디자인/개발 병렬 실행 이후 통합 구현을 위한 결정 완결형 스펙 확정

## 1) 제품 정의

### 1.1 한 줄 정의
"오늘의 주제"에 맞춰 10대 사용자가 익명으로 짧은 텍스트+스티커 게시물을 올리고, 다른 사용자가 즉시 반응/신고할 수 있는 모바일 우선 커뮤니티 웹앱.

### 1.2 타깃
- 핵심: 대한민국 13~19세 모바일 사용자
- 맥락: 쉬는 시간/이동 시간의 짧은 공백(1~3분)

### 1.3 핵심 가치
1. 즉시 참여(30초 내 첫 게시)
2. 즉시 피드백(반응 즉시 반영)
3. 안전한 참여(신고/숨김/금칙어)

## 2) MVP 목표와 범위

### 2.1 목표 (확정)
1. 게시 -> 노출 -> 반응 -> 신고의 기본 루프 안정 동작
2. 최소 안전 정책 3종 적용
   - 금칙어 필터
   - 세션 기반 rate limit
   - 신고 누적 자동 숨김
3. 스테이지 환경에서 실사용 테스트 가능한 품질 확보

### 2.2 비목표 (MVP 제외)
1. 영상 업로드/편집
2. 팔로우/DM/댓글 스레드
3. 개인화 추천 알고리즘
4. 수익화 기능

### 2.3 MVP 범위 동결 규칙
- 본 문서 범위를 벗어나는 신규 기능은 v2.x 백로그로만 등록하고 릴리스 스코프에 포함하지 않는다.

## 3) 사용자 시나리오

### 시나리오 A: 첫 게시
1. 사용자 접속
2. 오늘의 주제 확인
3. Composer에서 텍스트(<=120자)+스티커 선택
4. 게시 성공 후 피드 상단 노출 확인

### 시나리오 B: 반응
1. 피드 탐색
2. 게시물에 이모지 반응
3. 반응 수 즉시 업데이트 확인

### 시나리오 C: 신고
1. 부적절 게시물 신고
2. 사유 선택 후 제출
3. 접수 피드백 확인

## 4) 기능 요구사항 (FR)

### FR-1 세션
- 로그인 없이 `POST /api/session/init`로 익명 세션 시작
- 세션 식별자는 클라이언트 저장, 서버에는 해시만 저장

### FR-2 주제
- 상단에 단일 "오늘의 주제" 노출
- 초기 운영 방식: 서버 상수 또는 DB 단일 레코드

### FR-3 게시
- 입력: `text`, `sticker_id`, `topic_id`, `client_nonce`
- 제약: text <= 120자, sticker whitelist, 금칙어 검사
- 성공 시 피드 최신순 상단 반영

### FR-4 피드
- `GET /api/feed?topic_id&cursor&limit`
- status=`active`만 노출
- cursor 기반 페이지네이션

### FR-5 반응
- 이모지 3종(😀 ❤️ 🔥)
- 동일 세션/동일 게시물/동일 반응 중복 금지

### FR-6 신고
- 사유 enum: `sexual`, `hate`, `violence`, `other`
- 신고 누적 임계치 도달 시 해당 게시물 `hidden`

### FR-7 운영 API
- 관리자 토큰 기반 신고 조회 API
- 게시물 숨김 해제/영구차단 API

## 5) 비기능 요구사항 (NFR)

### NFR-1 성능
- 모바일 첫 화면 LCP 목표: <= 2.5s
- API p95 목표: <= 500ms (스테이징)

### NFR-2 접근성
- 터치 타깃 >= 44px
- 주요 텍스트 대비 WCAG AA 근사
- 포커스 링/모달 포커스 트랩 제공

### NFR-3 안정성
- 입력 검증 서버 단일 소스화
- 에러 코드 표준화(400/401/403/409/429/500)

### NFR-4 관측성
- 이벤트: `post_created`, `reaction_added`, `report_submitted`
- 대시보드 핵심: 에러율, 신고율, 숨김율

## 6) 정보 구조 및 UX 규칙

### 6.1 화면
1. Feed
2. Composer Modal
3. Report Modal

### 6.2 상태 매트릭스
- Feed: `loading | empty | ready | error`
- Composer: `default | typing | validation-error | submit-loading | submit-success | submit-error`
- Report: `default | reason-selected | submit-loading | submit-success | submit-error`
- Post: `normal | hidden | blocked`

### 6.3 인터랙션 규칙
1. 게시 버튼은 유효 입력 시만 활성
2. 금칙어 위반은 inline 에러로 즉시 안내
3. 신고 성공은 토스트 + 모달 종료
4. 중복 반응은 차단하고 안내 메시지 노출

## 7) 기술 아키텍처 (확정)

1. Frontend: Cloudflare Pages
2. API: Cloudflare Workers
3. DB: Cloudflare D1
4. Storage: MVP 미사용(R2 제외)

### 7.1 디렉터리 기준
- `b-mvp/web`
- `b-mvp/worker`
- `b-mvp/worker/migrations`
- `b-mvp/docs`

## 8) 데이터 모델 (확정)

### posts
- id TEXT PK
- topic_id TEXT
- text TEXT
- sticker_id TEXT
- session_hash TEXT
- created_at INTEGER
- status TEXT CHECK(active|hidden|blocked)

### reactions
- id TEXT PK
- post_id TEXT
- reaction_type TEXT
- session_hash TEXT
- created_at INTEGER
- UNIQUE(post_id, reaction_type, session_hash)

### reports
- id TEXT PK
- post_id TEXT
- reason TEXT
- detail TEXT
- session_hash TEXT
- created_at INTEGER
- status TEXT CHECK(queued|reviewed)

### sessions
- id TEXT PK
- created_at INTEGER
- risk_score INTEGER DEFAULT 0
- is_blocked INTEGER DEFAULT 0

## 9) API 계약 (v2.0)

### 9.1 POST /api/session/init
- req: `{}`
- res: `{ session_id: string }`

### 9.2 GET /api/feed
- query: `topic_id`, `cursor?`, `limit?`
- res: `{ items: FeedItem[], next_cursor: string | null }`

### 9.3 POST /api/posts
- req: `{ text: string, sticker_id: string, topic_id: string, client_nonce: string }`
- res: `{ post_id: string, created_at: number }`

### 9.4 POST /api/reactions
- req: `{ post_id: string, reaction_type: "smile"|"love"|"fire", client_nonce: string }`
- res: `{ ok: true }`

### 9.5 POST /api/reports
- req: `{ post_id: string, reason: "sexual"|"hate"|"violence"|"other", detail?: string }`
- res: `{ report_id: string, status: "queued" }`

### 9.6 GET /api/admin/reports
- header: `x-admin-token`
- res: `{ items: ReportItem[] }`

### 9.7 에러 코드
- 400_BAD_REQUEST
- 401_UNAUTHORIZED
- 403_FORBIDDEN
- 409_CONFLICT
- 429_RATE_LIMITED
- 500_INTERNAL

## 10) 안전/정책 가드레일 (확정)

1. 금칙어 필터(서버 측 강제)
2. 세션 기준 분당 요청 제한
3. 신고 임계치 기본값: `3`
4. 임계치 도달 시 자동 `hidden`
5. 관리자 검토 후 `active/blocked` 전환

## 11) 성공 지표 (MVP KPI)

1. 게시 참여율 = 게시 세션 / 활성 세션
2. 반응률 = 반응 수 / 노출 게시물 수
3. 신고율 = 신고 수 / 게시물 수
4. D7 리텐션
5. 안전지표 = 숨김 게시물 중 정책 위반 확정 비율

## 12) 병렬 실행 운영안 (디자이너 + 개발자)

### 12.1 병렬 시작 조건
1. 본 PRD 2.0 동결
2. API 계약(v2.0) 동결
3. 비목표 범위 동결

### 12.2 디자이너 트랙 산출물
1. `Design Spec MD`
2. `Token Spec MD`
3. `Accessibility Checklist MD`

### 12.3 개발자 트랙 산출물
1. `Architecture MD`
2. `API Spec MD`
3. `Implementation Checklist MD`

### 12.4 Merge Gate
1. 디자이너 상태 스펙 승인
2. 개발자 API 계약 충족
3. 안전 가드레일 3종 통과
4. 통과 시 통합 구현 스프린트 시작

## 13) 테스트 및 수용 기준

### 13.1 필수 E2E
1. session -> post -> feed 노출
2. reaction 중복 차단(409)
3. report 누적 3회 -> post hidden 전환

### 13.2 수용 기준
1. FR-1~FR-7 전부 충족
2. 모바일 360/390에서 주요 플로우 동작
3. 치명 버그 0
4. No-Go 항목 미발생

## 14) 일정 (5일)

- Day 1: 스캐폴딩 + 디자인 구조 확정
- Day 2: API 1차 + 디자인 토큰/상태 스펙
- Day 3: 프론트 연동 + QA 1차
- Day 4: 안전정책/관리 API + QA 2차
- Day 5: 스테이지 배포 + Go/No-Go

## 15) 변경 로그 (v1.0 -> v2.0)

1. 디자인 상태 매트릭스 및 접근성 요구 추가
2. 아키텍처/디렉터리/DB 스키마 구체화
3. API 요청/응답 스키마 및 에러 코드 확정
4. 신고 임계치 기본값(3) 확정
5. Merge Gate와 E2E 수용 기준 강화

## 16) 오픈 이슈

1. 오늘의 주제 운영 방식(코드 상수 vs 간단 관리자 UI)
2. 금칙어 사전 초기 버전 데이터 소스
3. 관리자 검토 SLA(예: 24시간)
