# k3s 마이그레이션 아키텍처 및 환경 변수 계약

> 기준 브랜치: `dev` | Phase 1 범위

새 기여자가 채팅 기록 없이 마이그레이션 목표와 환경 변수 계약을 파악할 수 있도록 작성된 문서입니다.

---

## 현재 상태

`ssemtle`은 이미 k3s로 운영 중이며, `vridge`는 Vercel에서 Supabase에 직접 연결하는 구조입니다.

```
[ 인터넷 ]
    |
[ Traefik (k3s) ]
    |
[ ssemtle (k3s Pod) ] ──직접 연결──> [ CloudNativePG 클러스터 (ssemtle용) ]

[ vridge (Vercel) ] ──────────────> [ Supabase ]
```

---

## 목표 상태

`vridge`를 Vercel에서 k3s로 이전하고, 전용 CloudNativePG 클러스터(`vridge-db`)에 직접 연결합니다.
`ssemtle`의 데이터베이스 경로는 변경하지 않습니다.

```
[ 인터넷 ]
    |
[ Traefik (k3s) ]
    |
    ├── [ ssemtle (k3s Pod) ] ──직접 연결──> [ CloudNativePG 클러스터 (ssemtle용) ]
    |
    └── [ vridge (k3s Pod) ]  ──직접 연결──> [ vridge-db (CloudNativePG 클러스터) ]
         namespace: vridge
```

---

## 네임스페이스

| 항목                | 값       |
| ------------------- | -------- |
| vridge 네임스페이스 | `vridge` |

레포 내 기존 네임스페이스 접미사 관례가 없으므로 접미사 없이 `vridge`를 사용합니다.

---

## 환경 변수 계약

환경 변수는 두 개의 시크릿 소스에서 분리하여 주입합니다.

### DB 변수 — CNPG 생성 시크릿 `vridge-db-app`

| 환경 변수      | 소스                                |
| -------------- | ----------------------------------- |
| `DATABASE_URL` | `vridge-db-app` 시크릿의 `uri` 필드 |
| `DIRECT_URL`   | Phase 1에서는 `DATABASE_URL`과 동일 |

### 앱 전용 변수 — 앱 관리 시크릿 `vridge-env`

| 환경 변수             | 설명                |
| --------------------- | ------------------- |
| `BETTER_AUTH_SECRET`  | Better Auth 서명 키 |
| `BETTER_AUTH_URL`     | 런타임 공개 URL     |
| `NEXT_PUBLIC_APP_URL` | 빌드 타임 공개 URL  |

> `ssemtle`의 시크릿 및 자격 증명은 `vridge`와 공유하지 않습니다.

---

## Phase 1 비목표

아래 항목은 Phase 1 범위에 포함되지 않습니다.

- **PgBouncer**: 커넥션 풀러를 추가하지 않습니다 (아래 Deferred 참고).
- **ssemtle DB 공유**: 테이블, 데이터베이스, 자격 증명을 공유하지 않습니다.
- **채용담당자 대시보드**: 애플리케이션 기능 확장은 마이그레이션 완료 후 별도로 진행합니다.

---

## Deferred

**PgBouncer**는 Phase 1 범위에 포함되지 않습니다.

`ssemtle`이 PgBouncer 없이 CNPG에 직접 연결하여 정상 운영 중이므로, `vridge`도 Phase 1에서는 동일한 직접 연결 방식을 사용합니다. PgBouncer 도입 시 설정 복잡도가 높아지며, 마이그레이션 완료 전에는 이점보다 위험이 더 큽니다.

---

## 참고

- 전체 태스크 목록: `.claude/tasks/`
- 마이그레이션 계획 원문: `prompt_plan.md`
