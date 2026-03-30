# vridge

베트남/영어/한국어(기본 `vi`)를 지원하는 ATS MVP 프로젝트입니다.

## 핵심 기능

- 채용공고 탐색/상세/지원
- 공지사항 목록/상세
- 후보자 공개 프로필(`app/candidate/[slug]/*`)
- 후보자 대시보드(내 프로필/편집/내 지원)
- Better Auth 기반 인증(이메일 + 소셜)
- 쿠키 기반 i18n (`vi`, `en`, `ko`)

## 기술 스택

### 프론트엔드 / 백엔드

|                  |                           |
| ---------------- | ------------------------- |
| Language         | TypeScript                |
| Framework        | Next.js 16 (App Router)   |
| UI               | React 19, Tailwind CSS v4 |
| Data Fetching    | TanStack Query v5         |
| State Management | Zustand v5                |
| Forms            | TanStack Form v1          |
| Validation       | Zod v4                    |
| Auth             | Better Auth v1            |

### 인프라

|          |                              |
| -------- | ---------------------------- |
| Database | PostgreSQL (CNPG / 로컬 Docker) |
| ORM      | Prisma v7                    |
| Storage  | AWS S3 Standard              |
| Hosting  | k3s + Helm + Traefik         |
| CI/CD    | GitHub Actions               |

### DX / 테스트

|                    |                                           |
| ------------------ | ----------------------------------------- |
| Linting            | ESLint v9                                 |
| Formatting         | Prettier v3 + prettier-plugin-tailwindcss |
| Git Hooks          | Husky + lint-staged                       |
| Unit / Integration | Jest v30 + Testing Library                |
| Component Dev      | Storybook v10                             |
| Analytics          | GA4 (`@next/third-parties`)               |

## 디렉터리 컨벤션

- 라우팅: `app/` (Next.js App Router 유지)
- 프론트엔드(FSD): `frontend/entities`, `frontend/features`, `frontend/widgets`, `frontend/components`, `frontend/hooks`
- 백엔드(Clean Architecture): `backend/domain`, `backend/use-cases`, `backend/infrastructure`, `backend/actions`, `backend/validations`
- 공용 i18n: `shared/i18n`
- Prisma: `backend/prisma` + `backend/generated/prisma`

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

로컬 DB 초기화와 시드 계정은 [`docs/test-db-local-setup.md`](docs/test-db-local-setup.md)를 기준으로 확인합니다.

## 프로덕션 컨테이너 빌드

프로덕션 이미지는 현재 `NEXT_PUBLIC_APP_URL`만 `docker build` 시점에 받습니다.
런타임 변수는 Kubernetes에서 주입하며, Helm 차트 기준 필수 계약은 `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`입니다.
분석/개인정보처리방침 관련 `NEXT_PUBLIC_*` 값은 앱 코드에서 optional이지만, 현재 기본 이미지 빌드/배포 계약에는 포함되어 있지 않습니다.

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  -t vridge:local .
```

```bash
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:54329/vridge_test \
  -e DIRECT_URL=postgresql://postgres:postgres@host.docker.internal:54329/vridge_test \
  -e BETTER_AUTH_SECRET=dev-secret-dev-secret-dev-secret \
  -e BETTER_AUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  vridge:local
```

GitHub Actions [`build-image.yml`](.github/workflows/build-image.yml)은 `dev`와 `production` 브랜치 push, 그리고 수동 실행에서 `ghcr.io/<owner>/vridge` 이미지를 빌드/푸시합니다.
배포 플로우와 시크릿 계약은 [`docs/runbook-deploy.md`](docs/runbook-deploy.md), 배포 아키텍처는 [`docs/k3s-migration.md`](docs/k3s-migration.md)를 기준으로 확인합니다.

## 스크립트

| Script                   | 설명                           |
| ------------------------ | ------------------------------ |
| `pnpm dev`               | 개발 서버 실행                 |
| `pnpm build`             | 프로덕션 빌드                  |
| `pnpm start`             | 프로덕션 서버 실행             |
| `pnpm lint`              | ESLint 실행                    |
| `pnpm test`              | Jest 실행                      |
| `pnpm db:test:bootstrap` | 테스트 DB bootstrap SQL 실행   |
| `pnpm db:test:push`      | 테스트 DB push                 |
| `pnpm db:test:seed`      | 테스트 DB seed                 |
| `pnpm db:test:reset`     | 테스트 DB 초기화 + push + seed |
| `pnpm storybook`         | Storybook 실행                 |
| `pnpm build-storybook`   | Storybook 빌드                 |

## i18n 정책

- 기본 로케일: `vi`
- 지원 로케일: `vi`, `en`, `ko`
- 로케일 저장: 쿠키(`vridge_locale`)
- URL 구조: 로케일 프리픽스 미사용
- 번역 누락: 영어 사전으로 폴백

## 주요 문서

- [`docs/project-state.md`](docs/project-state.md): 구현 범위와 현재 상태 요약
- [`docs/test-db-local-setup.md`](docs/test-db-local-setup.md): 로컬 개발/테스트 DB 초기화
- [`docs/runbook-deploy.md`](docs/runbook-deploy.md): k3s 배포 절차와 운영 체크리스트
- [`docs/k3s-migration.md`](docs/k3s-migration.md): 현재 배포 아키텍처와 환경 변수 계약
