#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
CHART_DIR="$ROOT_DIR/deploy/helm/vridge"

if ! command -v helm >/dev/null 2>&1; then
  echo "helm 명령을 찾을 수 없습니다. Helm을 설치한 뒤 다시 실행하세요." >&2
  exit 1
fi

if grep -R "\.Values\.namespace" "$CHART_DIR/templates" >/dev/null 2>&1; then
  echo "차트 템플릿에서 .Values.namespace를 사용하면 안 됩니다." >&2
  exit 1
fi

helm lint "$CHART_DIR"

rendered_file=$(mktemp)
duplicate_name_rendered_file=$(mktemp)
trap 'rm -f "$rendered_file" "$duplicate_name_rendered_file"' EXIT

helm template vridge-test "$CHART_DIR" --namespace vridge > "$rendered_file"
helm template vridge "$CHART_DIR" --namespace vridge > "$duplicate_name_rendered_file"

assert_doc_contains() {
  rendered_path=$1
  kind=$2
  pattern=$3
  message=$4

  if ! awk -v kind="$kind" -v pattern="$pattern" '
    $0 == "kind: " kind { in_doc = 1 }
    in_doc && $0 ~ pattern { found = 1 }
    in_doc && $0 == "---" { exit }
    END { exit found ? 0 : 1 }
  ' "$rendered_path"; then
    echo "$message" >&2
    exit 1
  fi
}

assert_doc_contains "$rendered_file" "Service" "^  type: ClusterIP$" "Service가 기본값 ClusterIP를 렌더링하지 않았습니다."
assert_doc_contains "$rendered_file" "Ingress" "^  ingressClassName: traefik$" "Ingress가 traefik ingress class를 렌더링하지 않았습니다."
assert_doc_contains "$rendered_file" "Ingress" '^    - host: "vridge\\.xyz"$' "Ingress host가 YAML 안전한 따옴표로 렌더링되지 않았습니다."
assert_doc_contains "$rendered_file" "Service" "^    app\\.kubernetes\\.io/name: vridge$" "Service selector에 표준 name 레이블이 없습니다."
assert_doc_contains "$rendered_file" "Service" "^    app\\.kubernetes\\.io/instance: vridge-test$" "Service selector에 release instance 레이블이 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^      app\\.kubernetes\\.io/name: vridge$" "Deployment selector에 표준 name 레이블이 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^      app\\.kubernetes\\.io/instance: vridge-test$" "Deployment selector에 release instance 레이블이 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^  namespace: vridge$" "Deployment가 release namespace를 렌더링하지 않았습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            readOnlyRootFilesystem: true$" "Deployment 컨테이너 보안 컨텍스트에 readOnlyRootFilesystem이 없습니다."
assert_doc_contains "$duplicate_name_rendered_file" "Deployment" "^  name: vridge$" "릴리스 이름과 차트 이름이 같을 때 fullname이 중복 렌더링됩니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: DATABASE_URL$" "Deployment에 DATABASE_URL 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: DIRECT_URL$" "Deployment에 DIRECT_URL 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  name: vridge-db-app$" "DATABASE_URL/DIRECT_URL이 vridge-db-app 시크릿을 참조하지 않습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  key: uri$" "DB secretKeyRef의 키가 uri가 아닙니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: BETTER_AUTH_SECRET$" "Deployment에 BETTER_AUTH_SECRET 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: BETTER_AUTH_URL$" "Deployment에 BETTER_AUTH_URL 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: NEXT_PUBLIC_APP_URL$" "Deployment에 NEXT_PUBLIC_APP_URL 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: NEXT_PUBLIC_GA_MEASUREMENT_ID$" "Deployment에 NEXT_PUBLIC_GA_MEASUREMENT_ID 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^            - name: NEXT_PUBLIC_PRIVACY_POLICY_URL$" "Deployment에 NEXT_PUBLIC_PRIVACY_POLICY_URL 환경변수가 없습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  name: vridge-env$" "앱 시크릿 vridge-env가 Deployment에 참조되지 않습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  key: NEXT_PUBLIC_APP_URL$" "NEXT_PUBLIC_APP_URL이 vridge-env 시크릿 키를 참조하지 않습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  key: NEXT_PUBLIC_GA_MEASUREMENT_ID$" "NEXT_PUBLIC_GA_MEASUREMENT_ID가 vridge-env 시크릿 키를 참조하지 않습니다."
assert_doc_contains "$rendered_file" "Deployment" "^                  key: NEXT_PUBLIC_PRIVACY_POLICY_URL$" "NEXT_PUBLIC_PRIVACY_POLICY_URL이 vridge-env 시크릿 키를 참조하지 않습니다."
assert_doc_contains "$rendered_file" "Job" "helm\\.sh/hook: pre-install,pre-upgrade" "Migration Job hook annotation이 없습니다."
assert_doc_contains "$rendered_file" "Job" "node_modules/prisma/bin/prisma" "Migration Job에 prisma migrate deploy 명령이 없습니다."
