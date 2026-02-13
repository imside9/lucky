# Design Plan: B안 MVP (익명 밈/리액션 웹앱)

- 기준 문서: `PRD-B-mvp.md`
- 버전: v1.0
- 작성일: 2026-02-13
- 목적: 개발자가 바로 구현 가능한 UI/UX 설계 실행 계획 확정

## 1. 설계 목표

1. 30초 내 첫 게시 달성을 위한 초저마찰 UX
2. Feed 중심 단일 플로우로 인지부하 최소화
3. 신고/안전 UX를 "강하지만 과하지 않게" 제공
4. 모바일 우선(360px, 390px) 기준 완성

## 2. 산출물 범위

1. `Design Spec MD`
- 화면 구조, 컴포넌트 구조, 상태 전이, 인터랙션 규칙

2. `Token Spec MD`
- 컬러/타이포/간격/라운드/그림자/모션 토큰

3. `Accessibility Checklist MD`
- 대비/포커스/터치 타깃/문구/오류 안내 점검 기준

## 3. 화면 및 IA 계획

## 3.1 Feed (메인)
- 상단: 오늘의 주제 + 짧은 설명
- 중단: 작성 CTA (고정 또는 sticky)
- 하단: 게시물 카드 목록(최신순)

## 3.2 Composer Modal
- 텍스트 입력(최대 120자)
- 스티커 선택(8~12개 preset)
- 글자수/금칙어/에러 메시지
- 게시 버튼(활성/비활성 상태 명확)

## 3.3 Report Modal
- 신고 사유 라디오(음란/혐오/폭력/기타)
- 상세 입력(선택)
- 제출 후 성공 피드백

## 4. 컴포넌트 설계 계획

1. Topic Header
- 정보 우선순위: 주제 > 보조설명 > 참여CTA

2. Post Card
- 본문(텍스트), 스티커, 시간, 반응 바, 신고 버튼
- 카드 밀도는 높되 탭 오작동 방지

3. Reaction Bar
- 이모지 3종
- 탭 즉시 카운트 반영(낙관적 UI)

4. Modal System
- Composer/Report 공통 토대
- 닫기, 배경 스크림, 스와이프 닫기(선택)

5. Toast/Inline Feedback
- 게시 성공, 신고 접수, 에러 안내

## 5. 상태 설계 (State Matrix)

1. Feed
- loading / empty / ready / error

2. Composer
- default / typing / validation-error / submit-loading / submit-success / submit-error

3. Report
- default / reason-selected / submit-loading / submit-success / submit-error

4. Post
- normal / hidden(신고 누적) / blocked(정책 위반)

## 6. 디자인 토큰 계획

## 6.1 Color
- 배경: 밝은 뉴트럴 계열
- 포인트: 청량한 블루-민트 계열
- 위험/경고: 레드/오렌지 명확 분리

## 6.2 Typography
- 모바일 가독성 우선
- 본문 최소 15px, 주요 CTA 16px 이상

## 6.3 Spacing & Radius
- 4/8/12/16/20 스케일
- 카드 radius 14~16, 모달 radius 18

## 6.4 Motion
- 120~180ms 짧은 전환
- 과한 애니메이션 금지

## 7. 인터랙션 규칙

1. 게시 버튼
- 텍스트 유효 + 스티커 선택 시 활성

2. 금칙어 실패
- 입력 하단 inline 에러 + 제출 비활성

3. 신고 완료
- 모달 닫힘 + 토스트 노출

4. 반응
- 1탭 1반응 보장, 중복 입력은 안내 메시지

## 8. 반응형 규칙

1. 360px
- 단일 컬럼, CTA full width
- 반응 바 아이콘 간격 축소

2. 390px
- 카드 여백 증가, 가독성 우선

3. Tablet 이상
- 최대 폭 컨테이너(예: 560px) 중앙 정렬

## 9. 접근성 계획

1. 대비 4.5:1 근접 충족
2. 버튼 최소 44px 터치 타깃
3. 포커스 링 명확 표시
4. 모달 열림 시 포커스 트랩
5. 오류 문구는 행동 지시 포함

## 10. 디자이너 작업 일정 (병렬 트랙)

- Day 1
1. 화면 구조 확정(Feed/Composer/Report)
2. 컴포넌트 목록 확정

- Day 2
1. 상태 매트릭스 작성
2. 토큰 초안 작성

- Day 3
1. 개발 전달용 컴포넌트 스펙(속성/상태/예외)
2. 접근성 체크리스트 작성

- Day 4
1. 개발 시안 리뷰
2. 상호작용 미세 조정

## 11. 개발 핸드오프 규격

1. 파일 단위 지시
- `index.html` 어떤 섹션 수정
- `style.css` selector 단위 수정
- `main.js` 상태 처리 연결 포인트

2. 상태별 캡처 리스트
- loading/empty/error/report-success

3. 금지사항
- MVP 범위 외 신규 패턴 추가 금지

## 12. 리스크 및 대응

1. 리스크: 정보 밀도 과다로 가독성 저하
- 대응: 카드 텍스트 3줄 클램프 + 상세 확장 보류

2. 리스크: 신고 UX가 무겁게 느껴짐
- 대응: 신고 프로세스 2단계 이내 유지

3. 리스크: 반응 오입력 증가
- 대응: 탭 피드백/중복 안내 명확화
