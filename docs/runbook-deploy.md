# vridge 배포 런북

## 1. 사전 조건

- k3s 클러스터가 실행 중이어야 함
- CloudNativePG operator가 설치되어 있어야 함:
  ```bash
  kubectl get pods -n cnpg-system
  ```
- kubeconfig 설정 — `/etc/rancher/k3s/k3s.yaml`을 직접 `chmod 644`하지 말 것. 대신 사용자 홈으로 복사:
  ```bash
  mkdir -p ~/.kube
  sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
  sudo chown $(whoami):$(whoami) ~/.kube/config
  ```
  > 주의: 복사한 kubeconfig는 원본 변경 시 자동 동기화되지 않음. k3s 업그레이드 후 재복사 필요.
- `helm` CLI가 설치되어 있어야 함

---

## 2. 최초 부트스트랩

> 클러스터에 vridge를 처음 배포할 때만 실행. 이미 설치된 경우 3번으로 이동.

**1단계: 네임스페이스 생성**
```bash
kubectl apply -f deploy/k8s/namespace.yaml
```

**2단계: CNPG 클러스터 생성**
```bash
kubectl apply -f deploy/k8s/cnpg-cluster.yaml
```

**3단계: 클러스터 Ready 대기**
```bash
kubectl wait --for=condition=Ready cluster/vridge-db -n vridge --timeout=120s
```

**4단계: `vridge-env` 시크릿 생성**

아래 `<값>` 플레이스홀더를 실제 값으로 교체한 후 실행:
```bash
# 임시 파일에 값 작성 (터미널 히스토리에 시크릿 노출 방지)
cat > /tmp/vridge-env.env <<'EOF'
BETTER_AUTH_SECRET=<값>
BETTER_AUTH_URL=<값>
NEXT_PUBLIC_APP_URL=<값>
EOF
chmod 600 /tmp/vridge-env.env

kubectl create secret generic vridge-env \
  --namespace vridge \
  --from-env-file=/tmp/vridge-env.env

# 임시 파일 안전 삭제
rm -f /tmp/vridge-env.env
```

> `vridge-db-app` 시크릿은 CNPG가 자동 생성함. 수동으로 생성하지 말 것.

---

## 3. 이미지 빌드 및 배포

### 일반 경로 (자동)

`production` 브랜치에 push하면 GitHub Actions가 순서대로 실행됨:
1. Build Image 워크플로 (`build-image.yml`) — 이미지 빌드 후 `ghcr.io/cgm-16/vridge:<tag>`로 push
2. CD 배포 워크플로 (`cd-deploy.yml`) — Helm으로 클러스터에 배포

> **마이그레이션**: `cd-deploy.yml`이 `helm upgrade`를 실행하면 Deployment의 initContainer가 `prisma migrate deploy`를 먼저 수행합니다. 별도 Helm hook Job은 사용하지 않습니다.

### 수동 트리거

GitHub Actions 탭 → `cd-deploy.yml` → `Run workflow` 버튼 클릭. 선택적으로 `image_tag` 값 입력 가능.

### 비상/로컬 배포

```bash
helm upgrade vridge deploy/helm/vridge \
  --install \
  --namespace vridge \
  --set-string "image.tag=sha-<커밋SHA>" \
  --wait \
  --rollback-on-failure \
  --timeout 5m
```

---

## 4. 인그레스 / DNS / 공개 URL

- 차트 기본 호스트: `vridge.xyz` 및 `www.vridge.xyz`
- 인그레스 클래스: `traefik`
- TLS: 기본 활성화. `cert-manager.io/cluster-issuer=letsencrypt-http` 어노테이션과 `vridge-tls` 시크릿을 사용

배포 시 호스트 오버라이드 방법:
```bash
helm upgrade vridge deploy/helm/vridge \
  --install \
  --namespace vridge \
  --set-string "image.tag=<TAG>" \
  --set "ingress.hosts[0].host=<실제호스트>" \
  --wait \
  --rollback-on-failure \
  --timeout 5m
```

---

## 5. 스모크 체크리스트

배포 후 아래 순서대로 수동 검증:

```bash
# 1. 파드 상태 확인
kubectl get pods -n vridge
# 기대값: vridge-* 파드가 Running 상태이며 READY 표시

# 2. 인그레스 존재 확인
kubectl get ingress -n vridge
# 기대값: vridge 인그레스가 올바른 호스트로 표시됨

# 3. 헬스체크 엔드포인트 확인
curl -sf https://<호스트>/healthz
# 기대값: {"status":"ok"}

# 4. 레디니스 엔드포인트 확인
curl -sf https://<호스트>/readyz
# 기대값: {"status":"ok"}

# 5. DB 연동 정상 기동 확인 (에러 없으면 정상)
kubectl logs -n vridge deploy/vridge --tail=50 | grep -i error || echo "에러 없음"
```

---

## 6. 시크릿 소유권

| 시크릿 | 소유자 | 관리 방법 |
|---|---|---|
| `vridge-db-app` | CNPG 자동 생성 | 수동 수정 금지. CNPG 클러스터 재생성 시 재생성됨 |
| `vridge-env` | 운영자 관리 | 아래 명령으로 업데이트 |

`vridge-env` 업데이트 (기존 시크릿을 덮어씀):
```bash
# 임시 파일에 새 값 작성
cat > /tmp/vridge-env.env <<'EOF'
BETTER_AUTH_SECRET=<새값>
BETTER_AUTH_URL=<새값>
NEXT_PUBLIC_APP_URL=<새값>
EOF
chmod 600 /tmp/vridge-env.env

kubectl create secret generic vridge-env \
  --namespace vridge \
  --from-env-file=/tmp/vridge-env.env \
  --dry-run=client -o yaml | kubectl apply -f -

# 임시 파일 안전 삭제
rm -f /tmp/vridge-env.env
```

---

## 7. 연기된 작업

- **PgBouncer**: 커넥션 풀링 미적용. 앱이 `vridge-db` CNPG 클러스터에 직접 연결 중.
- **스테이징 네임스페이스**: 미생성. 현재 단일 네임스페이스(`vridge`) 사용.
- **DB 백업 정책**: CNPG `ScheduledBackup` 리소스 미정의.
- **마이그레이션 의존성 포함 이미지 크기**: runner 스테이지에 Prisma CLI가 포함되어 있다. 필요 시 별도 migration 이미지로 분리 가능.
