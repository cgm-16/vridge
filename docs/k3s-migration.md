# k3s 배포 아키텍처 및 환경 변수 계약

> 기준 브랜치: `dev`

새 기여자가 현재 배포 구조와 환경 변수 계약을 빠르게 파악할 수 있도록 작성한 문서입니다.

---

## 현재 아키텍처

```
[ 인터넷 ]
    |
[ Traefik (k3s) ]
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
| `DIRECT_URL`   | 현재 `DATABASE_URL`과 동일          |

### 앱 전용 변수 — 앱 관리 시크릿 `vridge-env`

| 환경 변수                        | 설명                                    |
| -------------------------------- | --------------------------------------- |
| `BETTER_AUTH_SECRET`             | 런타임 시크릿                           |
| `BETTER_AUTH_URL`                | 런타임 공개 URL                         |
| `NEXT_PUBLIC_APP_URL`            | 앱 서버와 클라이언트가 공통으로 참조하는 공개 URL |

### 공개 빌드 변수 — GitHub Actions 빌드 시점 주입

| 환경 변수             | 설명               |
| --------------------- | ------------------ |
| `NEXT_PUBLIC_APP_URL` | 빌드 타임 공개 URL |

> 현재 기본 배포 계약에서 GitHub Actions가 이미지 빌드 시 주입하는 공개 변수는 `NEXT_PUBLIC_APP_URL` 하나입니다.
> `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_PRIVACY_POLICY_URL`는 앱 코드에서 optional이지만 현재 기본 Helm/워크플로 계약에는 포함되어 있지 않습니다.

---

## 비목표 / 운영 원칙

- **PgBouncer**: 현재 배포에는 포함하지 않습니다.
- **DB 공유**: `ssemtle`과 데이터베이스/자격 증명을 공유하지 않습니다.
- **시크릿 통합**: 앱 시크릿은 `vridge-env`, DB 접속은 `vridge-db-app`으로 분리합니다.

---

## 참고

- 배포 절차: `docs/runbook-deploy.md`
- Kubernetes 매니페스트 안내: `deploy/k8s/README.md`
