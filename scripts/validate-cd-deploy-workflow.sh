#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
WORKFLOW_PATH="$ROOT_DIR/.github/workflows/cd-deploy.yml"

if [ ! -f "$WORKFLOW_PATH" ]; then
  echo "CD 배포 워크플로우 파일이 없습니다: .github/workflows/cd-deploy.yml" >&2
  exit 1
fi

assert_contains() {
  pattern=$1
  message=$2

  if ! grep -Eq "$pattern" "$WORKFLOW_PATH"; then
    echo "$message" >&2
    exit 1
  fi
}

assert_not_contains() {
  pattern=$1
  message=$2

  if grep -Eq "$pattern" "$WORKFLOW_PATH"; then
    echo "$message" >&2
    exit 1
  fi
}

assert_contains '^[[:space:]]*name: CD Deploy$' "워크플로우 이름이 CD Deploy가 아닙니다."
assert_contains '^[[:space:]]*workflow_run:$' "워크플로우에 workflow_run 트리거가 없습니다."
assert_contains 'workflows:.*Build Image' "워크플로우 트리거에 Build Image 워크플로우 참조가 없습니다."
assert_contains 'types:.*completed' "workflow_run 트리거에 completed 타입이 없습니다."
assert_contains 'branches:.*production' "workflow_run 트리거의 branches에 production이 없습니다."
assert_contains '^[[:space:]]*workflow_dispatch:$' "워크플로우에 workflow_dispatch 트리거가 없습니다."
assert_contains '^[[:space:]]*concurrency:$' "워크플로우에 concurrency 블록이 없습니다."
assert_contains '^[[:space:]]*group:[[:space:]]*deploy-production$' "concurrency group이 deploy-production이 아닙니다."
assert_contains '^[[:space:]]*cancel-in-progress:[[:space:]]*false$' "concurrency cancel-in-progress가 false가 아닙니다."
assert_contains 'self-hosted' "runs-on에 self-hosted가 없습니다."
assert_contains 'k3s' "runs-on에 k3s가 없습니다."
assert_contains "workflow_run\.conclusion == 'success'" "잡 조건에 workflow_run.conclusion == 'success' 검사가 없습니다."
assert_contains 'helm lint' "워크플로우에 helm lint 단계가 없습니다."
assert_contains 'helm template' "워크플로우에 helm template 단계가 없습니다."
assert_contains 'helm upgrade' "워크플로우에 helm upgrade 단계가 없습니다."
assert_contains '\-\-install' "helm upgrade에 --install 플래그가 없습니다."
assert_contains '\-\-namespace vridge' "helm upgrade에 --namespace vridge 플래그가 없습니다."
assert_contains '\-\-wait' "helm upgrade에 --wait 플래그가 없습니다."
assert_contains '\-\-rollback-on-failure' "helm upgrade에 --rollback-on-failure 플래그가 없습니다."
assert_contains '\-\-timeout' "helm upgrade에 --timeout 플래그가 없습니다."
assert_contains 'KUBECONFIG:[[:space:]]*/home/ori/\.kube/config' "KUBECONFIG 환경 변수가 /home/ori/.kube/config로 설정되어 있지 않습니다."
assert_contains 'image\.tag=' "배포 단계에 image.tag= --set 플래그가 없습니다."
assert_contains '^[[:space:]]*permissions:$' "워크플로우에 permissions 블록이 없습니다."
assert_contains '^[[:space:]]*contents:[[:space:]]*read$' "워크플로우 권한에 contents: read가 없습니다."
assert_not_contains '(echo|printf|cat|tee).*\$\{\{.*(secrets\.|github\.token)' "워크플로우에서 시크릿 값을 출력 명령으로 로그에 노출하고 있습니다."
assert_not_contains '\$\{\{.*(secrets\.|github\.token).*>>' "워크플로우에서 시크릿 값을 리다이렉션으로 파일에 노출하고 있습니다."
