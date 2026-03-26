# vridge 프로젝트 부검

> 기준 브랜치: `dev` | 기준일: 2026-03-04 | 버전: v0.1.0 (MVP)

---

## 1. 프로젝트 요약

**vridge**는 베트남-한국 크로스보더 채용을 위한 ATS(Applicant Tracking System) MVP이다.

- **핵심 사용자**: 구직자(candidate), 채용담당자(recruiter), 관리자(admin)
- **핵심 기능**: 채용공고 탐색/상세/지원, 후보자 프로필 관리, 공지사항, 이메일+소셜 인증
- **다국어**: 베트남어(기본), 영어, 한국어 — 쿠키 기반 로케일 전환
- **인프라**: Supabase(PostgreSQL) + Vercel 배포 + GitHub Actions CI/CD
- **규모**: 332 커밋, 85 테스트 스위트(542개 테스트), 28개 라우트 파일

---

## 2. 프로젝트 철학

### 최소주의 & 실용주의

YAGNI 원칙을 준수하며 현재 필요한 최소한의 코드만 작성했다. 기능 추가보다 기존 코드의 명확성과 유지보수성을 우선시했다.

### 이원 아키텍처

백엔드는 **Clean Architecture**(domain → use-cases → infrastructure → actions), 프론트엔드는 **Feature-Sliced Design**(entities → features → widgets → app)을 채택했다. 두 아키텍처가 각각의 관심사를 분리하면서도 Server Actions를 통해 자연스럽게 연결된다.

### 테스트 주도 개발

TDD를 원칙으로 삼았다. 테스트는 "추가 작업"이 아니라 구현의 일부이며, 모든 Phase에서 테스트가 함께 작성되었다.

### Figma 기반 디자인 정렬

Figma node ID를 기준으로 디자인-구현 간극을 추적하고, 컴포넌트 단위로 정밀하게 정렬했다. 디자인 시스템 컴포넌트 24종을 3단계(3.1a/b/c)로 나눠 체계적으로 정렬 완료했다.

### 서버 우선

React Server Components + Server Actions를 기본으로 하고, 클라이언트 컴포넌트는 인터랙션이 필수인 경우에만 사용했다. REST API나 GraphQL 없이 Server Actions만으로 데이터 레이어를 구성했다.

### AI 협업 워크플로우

Claude와 Codex를 개발 파트너로 활용하며, 커스텀 에이전트(codebase-researcher, test-runner, lint-typecheck, figma-researcher)를 통한 작업 위임 전략을 체계화했다. 프롬프트 기반 순차 구현으로 17개 단위 작업을 점진적으로 빌드했다.

---

## 3. 기술 스택 및 패턴

### 3.1 기술 스택

| 범주           | 기술                                   | 버전   |
| -------------- | -------------------------------------- | ------ |
| 언어           | TypeScript (strict)                    | 5.9    |
| 프레임워크     | Next.js (App Router)                   | 16.1   |
| UI             | React                                  | 19.2   |
| UI 프리미티브  | Radix UI (shadcn 기반)                 | 1.4    |
| 아이콘         | Lucide React                           | 0.563  |
| 스타일링       | Tailwind CSS                           | 4      |
| 변형 관리      | Class Variance Authority (CVA)         | 0.7    |
| 상태 관리 (UI) | Zustand                                | 5      |
| 서버 상태      | TanStack Query                         | 5      |
| 폼 관리        | TanStack Form                          | 1      |
| 유효성 검사    | Zod                                    | 4      |
| 인증           | Better Auth                            | 1.4    |
| ORM            | Prisma (PostgreSQL 어댑터)             | 7.3    |
| 데이터베이스   | Supabase (PostgreSQL)                  | —      |
| 호스팅         | Vercel                                 | —      |
| 테스트         | Jest + Testing Library                 | 30     |
| 컴포넌트 문서  | Storybook                              | 10     |
| CI/CD          | GitHub Actions                         | —      |
| 패키지 매니저  | pnpm                                   | 10     |
| Git Hooks      | Husky + lint-staged                    | 9 / 16 |
| 포맷           | Prettier + prettier-plugin-tailwindcss | 3      |
| 린트           | ESLint (Flat Config)                   | 9      |
| 분석           | GA4 (@next/third-parties)              | —      |

### 3.2 아키텍처 패턴

#### 백엔드 계층 구조

```
backend/
├── domain/           # 도메인 규칙, 에러 타입, 인가 로직 (인프라 의존 없음)
├── use-cases/        # 비즈니스 로직, Prisma 쿼리
├── infrastructure/   # Prisma 클라이언트, Better Auth 인스턴스, 세션 유틸
├── actions/          # Server Actions (유스케이스 어댑터, Zod 검증)
├── validations/      # Zod 스키마
├── prisma/           # 스키마, 마이그레이션, 시드
└── generated/prisma/ # Prisma 자동 생성 코드
```

**데이터 흐름**: Page/Component → Server Action → Zod 입력 검증 → 권한 확인(domain) → use-case 호출 → Prisma 쿼리 → 결과 반환

**액션 결과 계약**:

```ts
// 성공
{ success: true, data?: T }

// 실패
{ errorCode: string, errorKey: string, errorMessage?: string }
```

#### 프론트엔드 FSD 구조

```
frontend/
├── entities/         # 도메인 표시 컴포넌트 (순수 렌더링, 동작 없음)
│   ├── profile/ui/   # ProfileCard, CareerList, EducationList ...
│   ├── job/ui/       # PostingListItem, JdCard, JdDetail ...
│   └── application/  # ApplicationStatus
├── features/         # 사용자 기능 단위
│   ├── auth/         # 로그인/회원가입 모달
│   ├── apply/        # 지원 버튼 + 뮤테이션
│   ├── job-browse/   # 검색, 필터, 정렬, 쿼리 상태
│   └── profile-edit/ # 프로필 편집 폼 + 뮤테이션
├── widgets/          # 조립된 UI 영역 (nav, sidebar)
├── components/ui/    # 공용 프리미티브 (Button, Input, Card ...)
├── hooks/            # 공유 커스텀 훅
├── lib/              # 유틸리티 (cn, presentation helpers)
└── stories/ui/       # Storybook 스토리 (14종)
```

#### 상태 분리 전략

| 상태 유형 | 저장소             | 예시                                |
| --------- | ------------------ | ----------------------------------- |
| URL 상태  | searchParams       | 검색어, 카테고리 필터, 정렬, 페이지 |
| 서버 상태 | TanStack Query     | 채용공고 목록, 프로필 데이터        |
| UI 상태   | Zustand            | 인증 모달 열림/닫힘                 |
| 폼 상태   | TanStack Form      | 프로필 편집 입력값                  |
| 세션 상태 | Better Auth (쿠키) | 로그인 세션, 사용자 정보            |

#### i18n 아키텍처

```
shared/i18n/
├── config.ts      # 로케일 설정 (vi 기본, en/ko 지원)
├── runtime.ts     # 번역기 생성, 인터폴레이션
├── server.ts      # getServerI18n() — 서버 컴포넌트용
├── client.tsx     # useI18n() — 클라이언트 컴포넌트용
├── catalog.ts     # 카탈로그 표시명 선택 헬퍼
├── action-error.ts # 에러 메시지 로컬라이징
└── messages/      # 번역 사전 (vi.ts, en.ts, ko.ts)
```

- 쿠키(`vridge_locale`)로 로케일 유지, URL 프리픽스 미사용
- 번역 누락 시 영어 사전으로 폴백
- 서버/클라이언트 분리: 서버는 `getServerI18n()`, 클라이언트는 `useI18n()`

### 3.3 DX 패턴

**Pre-commit 체크 (Husky)**:

1. `tsc --noEmit` — 타입 검사
2. `prisma validate` — 스키마 유효성
3. `lint-staged` — ESLint + Prettier (변경 파일만)

**CI 파이프라인**:

1. `pnpm install --frozen-lockfile`
2. ESLint (max-warnings: 0)
3. `BETTER_AUTH_SECRET` 환경변수 검증
4. Next.js 프로덕션 빌드
5. Jest + 커버리지

**자동 마이그레이션 배포**: `main` 브랜치에 `backend/prisma/migrations/**` 변경이 push되면 `prisma migrate deploy` 자동 실행

**AI 에이전트 위임**: 코드베이스 탐색(>3 파일), 테스트 실행, 타입 체크, 린트, Figma 리서치는 전용 서브에이전트로 위임. 아키텍처 결정과 구현은 메인 스레드에서 처리.

---

## 4. 스코프: 계획 vs 실행 vs 미완

### 4.1 완료된 범위

17개 구현 프롬프트 중 15개를 실행하고, 이후 Phase 5~7을 추가 진행했다.

| Phase            | 내용                                                            | 프롬프트 |
| ---------------- | --------------------------------------------------------------- | -------- |
| 1. Foundation    | Jest + Prisma 클라이언트 + 환경변수                             | #1       |
| 2. Auth          | BetterAuth 스키마/시드, 서버/클라이언트, 미들웨어               | #2~5     |
| 3. Data          | Zod 스키마, 도메인 에러/인가, 프로필/카탈로그/지원 CRUD         | #6~10    |
| 4. UI            | 레이아웃/내비게이션, 인증 모달, 프로필 표시/편집, 채용공고/지원 | #11~15   |
| 5. Design System | Figma 정렬 (DS 3.1a/b/c, 24개 공통 컴포넌트, 7개 라우트)        | P17~P24  |
| 6. i18n          | vi/en/ko 3개 로케일 롤아웃                                      | —        |
| 7. Storybook     | 14종 공용 컴포넌트 문서화                                       | —        |
| Hotfix           | 라우트별 Figma 불일치 보정, GA4 계측                            | —        |

**최종 품질 지표**: 85 suite, 542 tests 통과 / TypeScript clean / ESLint clean

### 4.2 구현된 라우트

| 라우트                    | 유형 | 상태                                                        |
| ------------------------- | ---- | ----------------------------------------------------------- |
| `/` → `/jobs` 리다이렉트  | 공개 | 완료                                                        |
| `/jobs`                   | 공개 | 완료 (검색, 카테고리 탭, 정렬, 직접 지원 CTA, 페이지네이션) |
| `/jobs/[id]`              | 공개 | 완료 (2열 레이아웃, 요약 카드, 공유 버튼, 지원 CTA)         |
| `/announcements`          | 공개 | 완료 (테이블형 목록, 고정 핀, 페이지네이션)                 |
| `/announcements/[id]`     | 공개 | 완료 (마크다운 본문, Next/Before 네비게이션)                |
| `/candidate/[slug]`       | 공개 | 완료 (공개 프로필 카드, 로케일 표시)                        |
| `/candidate/profile`      | 인증 | 완료 (읽기 전용 내 프로필, Edit CTA)                        |
| `/candidate/profile/edit` | 인증 | 완료 (전체 프로필 편집 폼, 저장 바)                         |
| `/candidate/applications` | 인증 | 완료 (지원 현황 요약 + 목록)                                |
| `/api/auth/*`             | API  | 완료 (Better Auth 핸들러)                                   |

### 4.3 미완/보류 항목

| 항목                            | 사유                        | 영향도                                    |
| ------------------------------- | --------------------------- | ----------------------------------------- |
| 채용담당자 대시보드 (Prompt 16) | MVP 범위 축소 결정          | 높음 — ATS의 채용 측 기능 전체            |
| S3 파일 업로드                  | AWS 자격 증명 미확보        | 중간 — 프로필 이미지/포트폴리오 첨부 불가 |
| 비밀번호 찾기/재설정            | 이메일 발송 인프라 필요     | 중간 — 비밀번호 분실 시 복구 불가         |
| Supabase RLS                    | 감사 문서 작성 완료, 미적용 | 높음 — DB 보안이 앱 레이어에만 의존       |
| 이메일 중복 실시간 검증         | 가입 플로우에서 제외        | 낮음                                      |
| 커스텀 로고 폰트                | 텍스트 로고로 MVP 대응      | 낮음                                      |
| 회사 로고 이미지                | 플레이스홀더 유지           | 낮음                                      |
| robots.txt / sitemap.xml        | SEO 기본 요소 미구현        | 중간 — 검색 엔진 인덱싱 불리              |
| Open Graph / 구조화 데이터      | 미구현                      | 중간 — 소셜 공유 시 프리뷰 미표시         |
| 에러 모니터링 (Sentry 등)       | 미설정                      | 높음 — 프로덕션 이슈 추적 불가            |
| Rate Limiting / CORS            | 미구현                      | 중간 — API 남용 방어 부재                 |
| 프로필 편집 풀-폭 레이아웃      | Figma 기준 미일치           | 낮음                                      |
| 카탈로그 관리 UI                | 시드/직접 DB 수정 의존      | 낮음 — 관리자 기능                        |

---

## 5. 인사이트

### 5.1 잘한 점

**아키텍처 분리가 효과적이었다.** Clean Architecture + FSD 이원 구조 덕분에 "이 코드가 어디에 있어야 하는가"에 대한 판단이 명확했다. 도메인 로직(domain)은 인프라 의존 없이 테스트 가능하고, 표시 컴포넌트(entities)는 동작 없이 재사용 가능하다.

**ActionResult 계약이 에러 처리를 일관되게 만들었다.** `{ success, data }` / `{ errorCode, errorKey }` 패턴으로 서버-클라이언트 간 에러 전달이 표준화되고, i18n 키 기반 에러 메시지 로컬라이징이 자연스럽게 연결되었다.

**서버 우선 아키텍처가 복잡성을 줄였다.** Server Components + Server Actions만으로 데이터 레이어를 구성하여 별도 API 서버/REST 엔드포인트 없이도 충분했다. 클라이언트 JS가 인터랙션이 필요한 곳(모달, 폼, 지원 버튼)에만 한정되었다.

**542개 테스트가 대규모 리팩터링을 가능하게 했다.** Phase 5에서 Figma 정렬을 위해 전체 UI를 재조정할 때, 기존 테스트가 회귀를 잡아주어 자신감 있게 변경할 수 있었다. `renderWithI18n` 유틸이 i18n 의존 테스트를 단순화했다.

**프롬프트 기반 점진적 구현이 복잡성을 관리했다.** 17개 단위 작업을 순차적으로 빌드하며, 각 프롬프트가 이전 결과 위에 쌓이는 구조였다. 이 방식은 한 번에 너무 많은 것을 바꾸는 리스크를 줄였다.

**URL 상태와 서버 상태 분리가 유효했다.** 검색/필터/정렬을 searchParams에 저장하여 페이지 새로고침/공유 시에도 상태가 유지되었고, 서버 데이터는 React Query가 캐시/재검증을 관리했다.

**종합 문서화가 온보딩을 용이하게 했다.** 인수인계 문서, 폴더 구조, DB 셋업 가이드, i18n 체크리스트, 마이그레이션 런북 등 11개 문서가 프로젝트 지식을 체계적으로 보존했다.

### 5.2 개선 가능한 점

**프로덕션 운영 기반이 부족하다.** 에러 모니터링(Sentry 등)이 없어 프로덕션 이슈를 사후적으로만 발견할 수 있다. SEO 기본 요소(robots.txt, sitemap, OG 태그)도 빠져 있어 검색 엔진/소셜 공유 대응이 불완전하다.

**DB 레벨 보안이 앱 레이어에 의존한다.** RLS 감사 문서(`supa_RLS.md`)는 작성되었지만 실제 적용은 보류 상태이다. 앱 레이어 인가(requireRole, assertOwnership)만으로는 Supabase 대시보드 등 직접 DB 접근 경로를 막지 못한다.

**ATS의 절반이 빠져 있다.** 채용담당자(recruiter) 기능이 전면 미구현이다. 지원자 목록 열람, 후보자 프로필 조회, 지원 상태 변경 등 ATS의 핵심 워크플로우가 없다. 백엔드 use-case와 action은 준비되어 있으나 UI가 없다.

**파일 업로드 인프라가 불완전하다.** S3 업로드 미구현으로 프로필 이미지와 포트폴리오 첨부가 작동하지 않는다. 스키마에 `profile_attachment` 모델은 존재하지만 실제 업로드 로직이 없다.

**a11y 검증이 수동에 의존한다.** Storybook addon-a11y가 설치되어 있지만, 자동화된 a11y 통합 테스트는 없다. 스크린 리더 호환성이나 키보드 네비게이션을 체계적으로 검증하지 못한다.

**테스트 커버리지를 공식 추적하지 않는다.** Jest v8 커버리지 프로바이더가 설정되어 있지만, CI에서 커버리지 임계값을 강제하거나 트렌드를 추적하는 시스템이 없다.

### 5.3 아키텍처 교훈

**Server Actions만으로 API를 대체할 수 있다 — 단, 내부 클라이언트에 한해서.** Next.js 앱 내에서는 Server Actions가 REST/GraphQL을 완전히 대체했다. 하지만 모바일 앱이나 외부 서비스에서 동일 데이터에 접근해야 한다면 별도 API 레이어가 필요해진다.

**Better Auth의 DB Hook이 프로비저닝을 단순화했다.** 사용자 생성 시 AppUser + ProfilesPublic + ProfilesPrivate를 자동 생성하는 패턴이 깔끔했다. 하지만 이 트랜잭션이 실패하면 인증 사용자만 존재하고 앱 사용자가 없는 불일치 상태가 될 수 있다.

**Zod + Prisma generated types 조합은 강력하지만 동기화 비용이 있다.** 스키마를 변경할 때 Prisma 스키마 → 마이그레이션 → Zod 스키마 → 테스트 데이터를 모두 업데이트해야 한다. Phase 5의 Prompt 17에서 이 동기화 작업이 가장 많은 파일을 건드렸다.

**쿠키 기반 i18n은 구현이 간단하지만 SEO/SSG에서 제약이 있다.** URL에 로케일이 없으므로 검색 엔진이 언어별 페이지를 구분하지 못한다. `hreflang` 태그나 로케일별 sitemap이 없어 다국어 SEO에 불리하다.

**FSD의 entities → features 계층 분리가 재사용을 강제했다.** ProfileCard를 entity로 만들어두니 공개 프로필과 내 프로필 모두에서 동일 컴포넌트를 사용할 수 있었다. 이 강제적 분리가 없었다면 페이지별로 유사한 컴포넌트가 중복 생겼을 것이다.

---

## 6. 기술 키워드 사전

이 프로젝트를 완전히 이해하기 위해 필요한 기술 키워드를 카테고리별로 정리한다.

### 프레임워크 & 런타임

| 키워드                            | 설명                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Next.js App Router**            | Next.js 13+ 도입된 파일 시스템 기반 라우팅. `app/` 디렉터리에서 layout, page, loading, error 파일로 라우트 구성  |
| **React Server Components (RSC)** | 서버에서만 실행되는 React 컴포넌트. 클라이언트 JS 번들에 포함되지 않으며, 직접 DB/파일 시스템 접근 가능          |
| **Server Actions**                | `'use server'` 지시어로 선언된 비동기 함수. 클라이언트에서 호출하면 서버에서 실행되어 별도 API 엔드포인트 불필요 |
| **React 19**                      | Concurrent 렌더링, use() 훅, Server Components 안정화 등이 포함된 React 최신 메이저 버전                         |
| **Streaming / Suspense**          | 서버에서 렌더링 결과를 점진적으로 전송하고, 로딩 상태를 `<Suspense>` 경계로 제어하는 패턴                        |

### 아키텍처

| 키워드                          | 설명                                                                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Clean Architecture**          | 도메인 로직을 인프라(DB, 외부 서비스)로부터 격리하는 계층형 아키텍처. domain → use-cases → infrastructure 방향으로 의존성이 흐름 |
| **Feature-Sliced Design (FSD)** | 프론트엔드 코드를 기능 단위(feature)로 분리하는 아키텍처 방법론. shared → entities → features → widgets → app 계층               |
| **Action Result Pattern**       | Server Action의 반환값을 `{ success, data }` / `{ errorCode, errorKey }` 형태로 표준화하는 계약                                  |
| **Domain Error**                | 비즈니스 규칙 위반을 표현하는 커스텀 에러 클래스. HTTP 상태 코드 대신 도메인 의미를 담는 에러 코드/키 사용                       |

### 인증 & 인가

| 키워드                           | 설명                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Better Auth**                  | Next.js 친화적인 인증 라이브러리. 이메일+비밀번호, OAuth, 세션 관리를 통합 제공                   |
| **OAuth 2.0**                    | 제3자 인증 프로토콜. Google/Facebook 로그인에 사용. `clientId`/`clientSecret` 기반                |
| **Cookie-based Sessions**        | 세션 토큰을 HTTP 쿠키에 저장하는 방식. `nextCookies()` 플러그인으로 Next.js와 통합                |
| **Route Protection Middleware**  | `proxy.ts`에 구현된 미들웨어. 공개/보호 경로를 구분하고, 미인증 접근을 리다이렉트                 |
| **DB Hooks (User Provisioning)** | Better Auth의 데이터베이스 후크. 인증 사용자 생성 시 앱 레벨 레코드(AppUser, Profile)를 자동 생성 |

### 데이터 레이어

| 키워드                       | 설명                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **Prisma ORM**               | TypeScript 친화적 ORM. 스키마 선언 → 클라이언트 자동 생성 → 타입 안전한 쿼리                     |
| **PostgreSQL**               | 오픈소스 관계형 데이터베이스. JSON, UUID, 함수/트리거 등 고급 기능 활용                          |
| **Supabase**                 | PostgreSQL 기반 BaaS. 이 프로젝트에서는 호스팅 DB + Connection Pooler로 사용                     |
| **Connection Pooling**       | DB 연결 재사용 메커니즘. Supabase의 pooler URL(포트 6543)과 직접 연결 URL(포트 5432)을 구분 사용 |
| **Database Migration**       | Prisma Migrate로 스키마 변경을 SQL 파일로 관리. `migrate deploy`로 프로덕션 적용                 |
| **Seed Script**              | 개발/테스트용 초기 데이터 삽입 스크립트. upsert 기반으로 멱등성 보장                             |
| **Row-Level Security (RLS)** | PostgreSQL의 행 단위 접근 제어 정책. 이 프로젝트에서는 감사 완료, 미적용 상태                    |

### 상태 관리

| 키워드                       | 설명                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| **TanStack Query**           | 서버 상태(비동기 데이터) 관리 라이브러리. 캐싱, 자동 재검증, 뮤테이션, DevTools 제공  |
| **Zustand**                  | 경량 클라이언트 상태 관리. 이 프로젝트에서는 인증 모달 등 UI 토글 상태에 사용         |
| **URL State (searchParams)** | 검색, 필터, 정렬, 페이지네이션을 URL 쿼리 파라미터에 저장. 새로고침/공유 시 상태 보존 |
| **TanStack Form**            | 폼 상태 관리 라이브러리. Zod 스키마와 통합하여 유효성 검사 + 타입 추론                |

### 유효성 검사

| 키워드                         | 설명                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| **Zod Schema**                 | TypeScript 우선 스키마 선언/유효성 검사 라이브러리. 런타임 검증 + 타입 추론 동시 제공 |
| **safeParse**                  | Zod의 안전한 파싱 메서드. 예외를 던지지 않고 `{ success, data, error }` 결과 반환     |
| **Schema Inference (z.infer)** | Zod 스키마로부터 TypeScript 타입을 자동 추론. 스키마와 타입의 단일 소스 유지          |

### 스타일링

| 키워드                                    | 설명                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| **Tailwind CSS v4**                       | 유틸리티 우선 CSS 프레임워크. v4에서 PostCSS 플러그인 방식으로 전환                     |
| **CSS Custom Properties (Design Tokens)** | `--color-brand`, `--color-gray-50` 등 CSS 변수로 디자인 토큰 관리. `@theme` 블록에 정의 |
| **Class Variance Authority (CVA)**        | 컴포넌트 변형(variant, size)을 타입 안전하게 관리하는 유틸리티                          |
| **tailwind-merge**                        | Tailwind 클래스 충돌을 해결하는 유틸리티. `cn()` 함수에서 clsx와 함께 사용              |

### UI 프리미티브

| 키워드                            | 설명                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| **Radix UI**                      | 접근성 기반 헤드리스 UI 컴포넌트 라이브러리. 스타일 없이 동작만 제공                  |
| **shadcn/ui**                     | Radix UI 위에 Tailwind 스타일을 입힌 컴포넌트 모음. 코드를 직접 복사하여 커스터마이징 |
| **Lucide Icons**                  | Feather Icons 포크. SVG 아이콘을 React 컴포넌트로 제공                                |
| **Slot (polymorphic components)** | Radix의 `Slot` 컴포넌트. `asChild` 패턴으로 렌더링 요소를 외부에서 지정               |

### 국제화 (i18n)

| 키워드                       | 설명                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| **Locale Cookie**            | 사용자 언어 설정을 쿠키(`vridge_locale`)에 저장. URL 변경 없이 언어 전환                  |
| **Translation Fallback**     | 특정 로케일에 번역이 없을 때 영어 사전에서 대체 텍스트를 가져오는 메커니즘                |
| **Server/Client i18n Split** | 서버 컴포넌트(`getServerI18n`)와 클라이언트 컴포넌트(`useI18n`)에서 각각 다른 진입점 사용 |
| **Interpolation**            | 번역 문자열 내 `{name}` 같은 토큰을 실제 값으로 치환하는 과정                             |

### 테스트

| 키워드                            | 설명                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------- |
| **Jest 30**                       | JavaScript 테스트 러너. v30에서 ECMAScript Modules 지원 개선                     |
| **React Testing Library**         | DOM 기반 React 컴포넌트 테스트 도구. 사용자 관점의 테스트 작성 촉진              |
| **jsdom**                         | 브라우저 없이 DOM을 시뮬레이션하는 환경. Jest의 `testEnvironment`로 사용         |
| **renderWithI18n**                | i18n 의존 컴포넌트를 테스트할 때 I18nProvider로 감싸주는 커스텀 유틸리티         |
| **TDD (Test-Driven Development)** | 실패하는 테스트를 먼저 작성하고, 테스트를 통과시키는 코드를 구현하는 개발 방법론 |

### 컴포넌트 문서

| 키워드                           | 설명                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| **Storybook 10**                 | UI 컴포넌트 개발/문서화 도구. 격리된 환경에서 컴포넌트를 렌더링하고 상태를 시각적으로 확인 |
| **CSF (Component Story Format)** | Storybook의 표준 스토리 작성 형식. default export(메타데이터) + named export(스토리)       |
| **Autodocs**                     | Storybook이 컴포넌트 props로부터 자동으로 문서 페이지를 생성하는 기능                      |

### CI/CD & DX

| 키워드                    | 설명                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **GitHub Actions**        | GitHub의 CI/CD 서비스. `.github/workflows/`에 YAML로 파이프라인 정의                   |
| **Husky**                 | Git Hook 관리 도구. pre-commit에 tsc, prisma validate, lint-staged를 실행              |
| **lint-staged**           | Git staged 파일에만 린터/포맷터를 실행하는 도구                                        |
| **Frozen Lockfile**       | `pnpm install --frozen-lockfile`로 lockfile 변경 없이 정확한 의존성 설치 보장          |
| **Prisma Migrate Deploy** | 프로덕션 환경에 마이그레이션을 적용하는 명령. `--create-only`와 달리 실제 DB 변경 실행 |
| **pnpm**                  | 디스크 효율적인 패키지 매니저. 심링크 기반 `node_modules` 구조                         |
| **ESLint Flat Config**    | ESLint v9의 새로운 설정 형식. `eslint.config.mjs`에 배열로 규칙 정의                   |
| **SWC**                   | Rust 기반 JavaScript/TypeScript 컴파일러. Next.js의 기본 트랜스파일러                  |

---

## 부록: 데이터베이스 모델 요약

| 모델                                                | 역할                        | PK 유형         |
| --------------------------------------------------- | --------------------------- | --------------- |
| User / Session / Account / Verification             | Better Auth 인증 테이블     | UUID            |
| AppUser                                             | 앱 레벨 사용자 (역할, 조직) | UUID (=User.id) |
| ProfilesPublic / ProfilesPrivate                    | 공개/비공개 프로필          | UUID (=User.id) |
| ProfileCareer / ProfileEducation / ProfileSkill     | 프로필 하위 섹션            | UUID            |
| ProfileLanguage / ProfileCertification / ProfileUrl | 프로필 하위 섹션            | UUID            |
| ProfileAttachment                                   | 파일 첨부 (S3, 미구현)      | UUID            |
| Org                                                 | 조직(고용주)                | UUID            |
| JobFamily / Job / Skill / SkillAlias                | 카탈로그 데이터             | 텍스트 슬러그   |
| JobDescription / JobDescriptionSkill                | 채용공고 + 필요 스킬        | UUID            |
| Apply                                               | 지원 내역                   | UUID            |
| Announcement                                        | 공지사항                    | UUID            |

**주요 Enum**: `AppRole`(candidate/recruiter/admin), `ApplyStatus`(applied/accepted/rejected/withdrawn), `JobPostingStatus`(recruiting/done), `EmploymentType`, `WorkArrangement`, `LanguageProficiency`, `ExperienceLevel`, `EducationType`, `GraduationStatus`, `AttachmentType`
