# ATS MVP 구현 계획 — Phase 5: Polish + Announcement

> 이 파일은 `docs/implementation-plan.md`에서 분리된 Phase 5 계획입니다.
> (implementation-plan.md 분량 과다로 분리)

---

## 진행 상황

| #   | 프롬프트               | 레이어       | 산출물                       | 상태 |
| --- | ---------------------- | ------------ | ---------------------------- | ---- |
| 17  | Uploads + Polish + E2E | Infra/Polish | S3, 에러 처리, 스모크 테스트 | ⬜   |
| 18  | Announcement Pages     | UI/Page      | 공지사항 목록·상세 페이지    | ⬜   |

> **범례**: ✅ 완료 / ⬜ 미착수

---

## Phase 5: Polish

### Prompt 17: File Uploads + Error Handling + E2E Smoke Test

**목표**: S3 첨부파일, 전역 에러/로딩 상태, 통합 스모크 테스트.
**생성 파일**: `lib/infrastructure/s3.ts`, `lib/use-cases/attachments.ts`, `lib/actions/attachments.ts`, 에러/로딩/404 페이지, `__tests__/e2e/smoke.test.ts`

```
이전: 모든 기능 존재. 이 프롬프트는 파일 업로드, 마감, E2E 검증을 추가.

Task 1: lib/infrastructure/s3.ts 생성.
- 환경 변수에서 S3 클라이언트 (AWS_S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY, S3_ENDPOINT non-AWS용 optional).
- generateUploadKey(userId, ext): "users/{userId}/attachments/{uuid}.{ext}".
- getSignedUploadUrl(key, contentType, maxSize).
- getSignedDownloadUrl(key).
- deleteObject(key).
- .env.example에 S3 변수 추가.

Task 2: lib/use-cases/attachments.ts + lib/actions/attachments.ts 생성.
- requestUploadUrl(userId, fileName, mimeType): AttachmentType enum 대비 파일 유형 검증,
  키 생성, profile_attachment 행 생성, signed URL 반환.
- deleteAttachment(userId, attachmentId): assertOwnership, S3 객체 + DB 행 삭제.
- getDownloadUrl(viewerId, viewerRole, attachmentId): authorization 체크
  (소유자 또는 canViewCandidate인 recruiter), signed URL 반환.

Task 3: 에러 처리 및 로딩 상태.
- app/error.tsx: 전역 에러 바운더리 ("use client"), 친화적 메시지 + 재시도 버튼.
- app/not-found.tsx: 커스텀 404 + "홈으로" 링크.
- app/(dashboard)/candidate/profile/loading.tsx: 스켈레톤.
- app/(dashboard)/candidate/jobs/loading.tsx: 카드 스켈레톤 그리드.
- app/(dashboard)/recruiter/loading.tsx: 스켈레톤.

Task 4: __tests__/e2e/smoke.test.ts 통합 스모크 테스트.
- Auth 레이어 모킹 (알려진 유저 세션 설정).
- 후보자 플로우: getMyProfile → updateProfilePublic → addProfileCareer →
  getJobDescriptions → createApply → getMyApplications (새 지원 포함).
- 채용담당자 플로우: getApplicationsForJd → getProfileForRecruiter partial
  (private 없음) → full (private 포함).
- Authorization: candidate가 recruiter 액션 호출 불가, recruiter가 프로필 수정 불가.

검증: pnpm test 통과, pnpm build 성공, pnpm lint 통과.
```

---

## Phase 6: Announcement

### Prompt 18: Announcement Pages

**목표**: 공개 공지사항 목록 및 상세 페이지.
**생성 파일**: `app/announcement/page.tsx`, `app/announcement/[id]/page.tsx`

> **선결 사항**: 공지사항 데이터 소스 결정 필요.
> 옵션 A — Prisma 모델 추가 (DB 기반, 관리자 작성 가능)
> 옵션 B — 정적 MDX/JSON 파일 (코드 기반, 빌드타임 렌더링)
> 옵션 C — 외부 CMS (Notion, Contentful 등)

```
이전: 공개 채용공고 목록/상세 (app/jobs/) 존재. 같은 패턴 적용.

Task 1: 데이터 소스 결정 후 데이터 접근 레이어 구현.
  (옵션 A) lib/use-cases/announcements.ts + lib/actions/announcements.ts:
    - getAnnouncements(): 목록, createdAt desc 정렬
    - getAnnouncementById(id): 없으면 notFound() 호출

Task 2: app/announcement/page.tsx 생성 — Server Component.
- getAnnouncements() 호출, 제목·날짜 목록 렌더링.
- 상세 페이지로 링크.
- 빈 상태 처리.

Task 3: app/announcement/[id]/page.tsx 생성 — Server Component.
- getAnnouncementById(id) 호출.
- 제목, 날짜, 본문 (react-markdown) 렌더링.
- 없으면 Next.js notFound() 호출.

Task 4: 테스트.
- 목록 페이지: 항목 렌더링, 빈 상태.
- 상세 페이지: 마크다운 렌더링, 없는 ID 처리.

검증: pnpm test 통과, tsc --noEmit 통과.
```
