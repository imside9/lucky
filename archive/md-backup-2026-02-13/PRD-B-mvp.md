# PRD: B안 MVP - 10대 익명 밈/리액션 웹앱

- 버전: v1.0
- 작성일: 2026-02-13
- 문서 목적: B안(콘텐츠 유형 전환) MVP를 정의하고, 디자이너/개발자가 병렬로 즉시 실행 가능한 기준 제공

## 1. 제품 개요

### 1.1 배경
10대의 짧은 공백 시간(쉬는 시간, 이동 시간)에는 빠른 소비형 앱 이용이 높다. A안(퀴즈 보상형)과 달리 B안은 `소비`보다 `참여/표현`에 초점을 맞춘다.

### 1.2 제품 한 줄 정의
"오늘의 주제"에 10대가 익명으로 짧은 밈/한줄글을 올리고, 다른 사용자가 즉시 반응(이모지)하는 초경량 커뮤니티 웹앱.

### 1.3 타깃 사용자
- 13~19세 모바일 사용자
- 짧은 시간에 가볍게 참여하고 싶은 사용자
- 익명 기반으로 부담 없이 반응을 주고받고 싶은 사용자

## 2. 목표와 비목표

### 2.1 목표 (MVP)
1. 30초 내 첫 게시물 작성 가능
2. 게시물 생성 -> 피드 노출 -> 반응/신고의 기본 루프 동작
3. 부적절 콘텐츠 최소 안전장치(금칙어/신고 누적 숨김) 동작

### 2.2 비목표 (MVP 제외)
1. 팔로우/친구 그래프
2. DM/댓글 스레드
3. 영상 업로드/편집
4. 개인화 추천 알고리즘
5. 수익화 기능

## 3. 핵심 사용자 시나리오

### 시나리오 A: 첫 참여
1. 사용자가 랜딩 접속
2. "오늘의 주제" 확인
3. 텍스트 + 스티커 선택 후 게시
4. 피드에서 본인 게시물 확인

### 시나리오 B: 반응
1. 사용자가 피드를 스크롤
2. 마음에 드는 게시물에 이모지 반응
3. 즉시 반영된 반응 수 확인

### 시나리오 C: 신고
1. 부적절 게시물 발견
2. 신고 사유 선택 후 제출
3. 신고 접수 피드백 확인

## 4. 기능 요구사항 (Functional Requirements)

### FR-1. 세션 시작
- 익명 세션 생성(로그인 없음)
- 새로고침/재방문 시 세션 유지

### FR-2. 오늘의 주제 표시
- 상단에 고정된 단일 주제 표시
- 주제는 운영자가 교체 가능(초기엔 하드코딩 허용)

### FR-3. 게시물 작성
- 입력: 텍스트(최대 120자), 스티커 1개
- 금칙어 검사 실패 시 업로드 차단
- 작성 성공 시 피드 상단 노출

### FR-4. 피드 조회
- 최신순 목록
- 페이지네이션(또는 무한 스크롤) 지원
- 숨김/차단 상태 게시물 제외

### FR-5. 반응(리액션)
- 게시물당 이모지 반응(예: 😀, ❤️, 🔥)
- 세션당 동일 게시물/동일 반응 1회 제한

### FR-6. 신고
- 신고 사유 선택형(음란/혐오/폭력/기타)
- 신고 누적 임계치 도달 시 자동 숨김 처리

### FR-7. 기본 운영
- 관리자 토큰 기반 신고 목록 조회 API
- 게시물 숨김 해제/영구숨김 API(간단 버전)

## 5. 비기능 요구사항 (Non-Functional Requirements)

### NFR-1. 성능
- 첫 화면 로드 LCP 2.5초 이내(모바일 4G 기준 목표)
- API p95 응답 500ms 이내(스테이징 기준)

### NFR-2. 안전
- 금칙어 필터
- 세션당 요청 제한(rate limit)
- 신고 누적 자동 숨김

### NFR-3. 접근성
- 주요 버튼 터치 타깃 44px 이상
- 텍스트 대비 WCAG AA 근사 충족
- 키보드 포커스 스타일 유지

### NFR-4. 관측성
- 게시/반응/신고 이벤트 로깅
- 에러율, 신고율, 숨김율 대시보드 확인 가능

## 6. 정보 구조 / 화면 구성

### 화면 1) Feed
- 오늘의 주제
- 작성 CTA
- 게시물 카드 리스트

### 화면 2) Composer Modal
- 텍스트 입력
- 스티커 선택
- 게시 버튼

### 화면 3) Report Modal
- 신고 사유 선택
- 제출

## 7. 데이터 모델 (MVP)

### posts
- id
- topic_id
- text
- sticker_id
- session_hash
- created_at
- status(active/hidden/blocked)

### reactions
- id
- post_id
- reaction_type
- session_hash
- created_at

### reports
- id
- post_id
- reason
- detail
- session_hash
- created_at
- status(queued/reviewed)

### sessions
- id
- created_at
- risk_score
- is_blocked

## 8. API 계약 (초안)

1. `POST /api/session/init`
- response: `{ session_id }`

2. `GET /api/feed?topic_id=...&cursor=...`
- response: `{ items: [], next_cursor }`

3. `POST /api/posts`
- body: `{ text, sticker_id, topic_id, client_nonce }`
- response: `{ post_id, created_at }`

4. `POST /api/reactions`
- body: `{ post_id, reaction_type, client_nonce }`
- response: `{ ok: true }`

5. `POST /api/reports`
- body: `{ post_id, reason, detail }`
- response: `{ report_id, status }`

## 9. 안전/정책 가드레일

1. 욕설/혐오 금칙어 사전 적용
2. 세션 기준 분당 게시/반응 횟수 제한
3. 동일 게시물 신고 누적 임계치(예: 3회) 이상 자동 숨김
4. 청소년 보호 관점의 금지 콘텐츠 목록 운영

## 10. 성공 지표 (MVP)

1. 주간 게시 참여율 = 게시 세션 / 활성 세션
2. 반응률 = 반응 수 / 피드 노출 게시물 수
3. 신고율 = 신고 수 / 게시물 수
4. 7일 리텐션(D7)

## 11. 릴리스 기준 (Go/No-Go)

### Go
1. 게시/조회/반응/신고 기본 루프 정상
2. 자동 숨김 정책 정상
3. 치명 오류율 임계치 이하

### No-Go
1. 금칙어/신고 정책 우회 가능
2. 데이터 유실 또는 중복이 빈번
3. 모바일 주요 화면 사용성 문제 심각

## 12. 병렬 실행 계획 (Designer + Developer)

### 공통 시작 조건
- 본 PRD v1.0 동결
- API 계약(섹션 8) 동결
- MVP 범위(섹션 2.2) 동결

### 디자이너 병렬 트랙 (D-Track)

#### 산출물
1. `Design Spec MD`
- 화면별 레이아웃(Feed/Composer/Report)
- 컴포넌트 스펙(카드, 버튼, 모달, 반응 바)
- 상태 스펙(loading/empty/error/report-success)

2. `Token Spec MD`
- 색상, 타이포, 간격, 라운드, 그림자

3. `Accessibility Checklist MD`
- 대비, 포커스, 터치 타깃, 문구 가독성

#### 완료 기준
1. 개발자가 그대로 구현 가능한 selector/컴포넌트 단위 지시 포함
2. 모바일 360px/390px 기준 검토 포함

### 개발자 병렬 트랙 (E-Track)

#### 산출물
1. `Architecture MD`
- Cloudflare Pages + Workers + D1 구성도
- 데이터 흐름 및 예외 처리 흐름

2. `API Spec MD`
- 요청/응답 스키마
- 에러 코드 표

3. `Implementation Checklist MD`
- FR별 구현 체크리스트
- 테스트 케이스

#### 완료 기준
1. 로컬/스테이지에서 핵심 API 동작 확인 가능
2. 프론트와 연동 가능한 mock 또는 실제 endpoint 제공

### 병렬 후 합류 지점 (Merge Gate)
1. 디자이너: 상태/컴포넌트 스펙 승인
2. 개발자: API 계약 충족 확인
3. 둘 다 충족 시 통합 구현 스프린트 시작

## 13. 일정 제안 (5일 MVP 스프린트)

- Day 1: PRD 동결 + 디자인/개발 병렬 착수
- Day 2: 디자인 스펙 1차 + API 골격
- Day 3: UI 컴포넌트 구현 + API 연동
- Day 4: 안전장치/신고 플로우/QA
- Day 5: 스테이지 배포 + 지표 점검

## 14. 오픈 이슈

1. 운영자가 "오늘의 주제"를 어디서 관리할지(코드/관리 페이지)
2. 금칙어 사전 초기 버전 소스
3. 신고 임계치 기본값(3회 vs 5회)
