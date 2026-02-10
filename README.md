# vridge

## Tech Stack

### Frontend / Backend

|                  |                                 |
| ---------------- | ------------------------------- |
| Language         | TypeScript                      |
| Framework        | Next.js 16 (App Router)         |
| UI               | React 19, Tailwind CSS v4       |
| Data Fetching    | TanStack Query (React Query) v5 |
| State Management | Zustand v5                      |
| Forms            | TanStack Form v1                |
| Validation       | Zod v4                          |
| Auth             | Better-Auth v1                  |

### Infrastructure

|          |                       |
| -------- | --------------------- |
| Database | Supabase (PostgreSQL) |
| ORM      | Prisma v7             |
| Storage  | AWS S3 Standard       |
| Hosting  | Vercel                |
| CI/CD    | GitHub Actions        |

### DX / Testing

|                    |                                           |
| ------------------ | ----------------------------------------- |
| Linting            | ESLint v9                                 |
| Formatting         | Prettier v3 + prettier-plugin-tailwindcss |
| Git Hooks          | Husky + lint-staged                       |
| Unit / Integration | Jest v30 + Testing Library                |
| Component Dev      | Storybook v10                             |
| Analytics          | GA4 (via @next/third-parties)             |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Script                 | Description              |
| ---------------------- | ------------------------ |
| `pnpm dev`             | Start development server |
| `pnpm build`           | Build for production     |
| `pnpm start`           | Start production server  |
| `pnpm lint`            | Run ESLint               |
| `pnpm test`            | Run Jest                 |
| `pnpm storybook`       | Start Storybook          |
| `pnpm build-storybook` | Build Storybook          |
