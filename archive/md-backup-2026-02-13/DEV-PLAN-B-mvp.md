# Engineering Plan: B안 MVP (익명 밈/리액션 웹앱)

- 기준 문서: `PRD-B-mvp.md`
- 버전: v1.0
- 작성일: 2026-02-13
- 목적: Cloudflare 기반으로 MVP 구현을 위한 기술 실행 계획 확정

## 1. 구현 목표

1. 게시/조회/반응/신고 핵심 API 안정 동작
2. 모바일 웹 프론트와 API 연동 완료
3. 최소 안전장치(금칙어, rate limit, 신고 누적 숨김) 적용
4. 스테이지 배포 가능 상태 확보

## 2. 아키텍처 선택

1. Frontend: Cloudflare Pages (정적 웹)
2. API: Cloudflare Workers
3. Database: Cloudflare D1
4. Optional: R2 (현재 MVP에선 미사용; 스티커 preset 사용)

## 3. 코드 구조 계획

1. `b-mvp/web`
- UI 템플릿, 상태 관리, API 클라이언트

2. `b-mvp/worker`
- 라우팅, 입력 검증, 정책 로직, D1 access

3. `b-mvp/worker/migrations`
- D1 스키마 마이그레이션 SQL

4. `b-mvp/docs`
- API 스키마, 운영 런북, 테스트 체크리스트

## 4. 데이터 모델 구현 계획

1. posts
- `id TEXT PK`
- `topic_id TEXT`
- `text TEXT`
- `sticker_id TEXT`
- `session_hash TEXT`
- `created_at INTEGER`
- `status TEXT` (active|hidden|blocked)

2. reactions
- `id TEXT PK`
- `post_id TEXT`
- `reaction_type TEXT`
- `session_hash TEXT`
- `created_at INTEGER`
- unique(post_id, reaction_type, session_hash)

3. reports
- `id TEXT PK`
- `post_id TEXT`
- `reason TEXT`
- `detail TEXT`
- `session_hash TEXT`
- `created_at INTEGER`
- `status TEXT` (queued|reviewed)

4. sessions
- `id TEXT PK`
- `created_at INTEGER`
- `risk_score INTEGER`
- `is_blocked INTEGER`

## 5. API 상세 계획

1. `POST /api/session/init`
- 역할: 익명 세션 발급/재사용
- 처리: 쿠키 또는 local token

2. `GET /api/feed`
- 파라미터: `topic_id`, `cursor`, `limit`
- 처리: active 상태만 조회, 최신순

3. `POST /api/posts`
- 검증: text 길이<=120, sticker_id whitelist, 금칙어 체크
- 정책: 세션 기준 분당 게시 제한

4. `POST /api/reactions`
- 검증: reaction_type whitelist
- 정책: 동일 세션/동일 반응 중복 방지

5. `POST /api/reports`
- 검증: reason enum
- 정책: 신고 누적 임계치 도달 시 posts.status=hidden

6. `GET /api/admin/reports` (토큰 보호)
- 역할: 신고 큐 조회

## 6. 보안/안전 구현 계획

1. 금칙어 필터
- 정규식 + 키워드 테이블(초기 하드코딩)

2. Rate limiting
- 간단 버전: D1 기반 카운트(세션+분 버킷)
- 고도화 옵션: Cloudflare rate limit 기능 연동

3. 세션 보호
- session_id 해시 저장
- 민감정보 비저장

4. CORS/Origin 체크
- 스테이지 도메인 화이트리스트

## 7. 프론트엔드 연동 계획

1. API 클라이언트 유틸
- 공통 fetch wrapper, 에러 표준화

2. 상태 관리
- feed loading/empty/error
- composer submit states
- report submit states

3. 이벤트 로깅
- post_created, reaction_added, report_submitted

## 8. 테스트 계획

## 8.1 단위 테스트
1. validation(text, reason, reaction)
2. 금칙어 필터
3. 신고 임계치 숨김 로직

## 8.2 통합 테스트
1. session -> post -> feed 노출
2. reaction 중복 제한
3. report 누적 후 hidden 전환

## 8.3 수동 QA
1. 모바일(360/390) 작성 플로우
2. 네트워크 지연 시 오류 처리
3. 신고 성공 피드백 확인

## 9. 에러 코드 정책

- `400_BAD_REQUEST`: 입력 검증 실패
- `401_UNAUTHORIZED`: 관리자 토큰 누락/불일치
- `403_FORBIDDEN`: 차단 세션
- `409_CONFLICT`: 중복 반응
- `429_RATE_LIMITED`: 요청 과다
- `500_INTERNAL`: 서버 내부 오류

## 10. 일정 (병렬 트랙)

- Day 1
1. 프로젝트 스캐폴딩
2. D1 스키마 작성
3. session/feed API 초안

- Day 2
1. posts/reactions/reports API 구현
2. 금칙어 및 rate limit 1차 반영

- Day 3
1. 프론트 연동
2. 기본 QA

- Day 4
1. 신고 누적 숨김/관리자 API
2. 에러 처리/로깅 보강

- Day 5
1. 스테이지 배포
2. Go/No-Go 체크

## 11. Merge Gate 체크리스트

1. PRD의 FR-1~FR-7 모두 구현됨
2. API 계약(섹션 8)과 응답 스키마 일치
3. 안전 가드레일 3종(금칙어/rate limit/신고숨김) 동작
4. 디자이너 상태 스펙과 UI 상태 일치

## 12. 리스크 및 대응

1. 리스크: 서버리스 cold start 영향
- 대응: 경량 핸들러, 불필요 의존성 제거

2. 리스크: D1 동시성/쿼리 병목
- 대응: 인덱스 우선 적용, 쿼리 단순화

3. 리스크: 악성 입력 우회
- 대응: 서버측 검증 단일 소스화

4. 리스크: 일정 내 기능 과다
- 대응: Out-of-scope 엄격 준수
