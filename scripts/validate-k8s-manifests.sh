#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if command -v yamllint >/dev/null 2>&1; then
  YAMLLINT=yamllint
elif command -v uv >/dev/null 2>&1; then
  YAMLLINT="uv tool run yamllint"
else
  echo "yamllint이 필요합니다: uv tool install yamllint" >&2
  exit 1
fi

$YAMLLINT -d '{extends: default, rules: {line-length: {max: 120}, comments-indentation: disable}}' \
  "$ROOT_DIR/deploy/k8s/namespace.yaml" \
  "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml"

failures=0

assert_contains() {
  file=$1
  pattern=$2
  description=$3

  if grep -q "$pattern" "$file"; then
    echo "통과: $description"
  else
    echo "실패: $description" >&2
    failures=$((failures + 1))
  fi
}

assert_contains "$ROOT_DIR/deploy/k8s/namespace.yaml" "kind: Namespace" "namespace.yaml에 kind: Namespace 포함"
assert_contains "$ROOT_DIR/deploy/k8s/namespace.yaml" "name: vridge" "namespace.yaml에 name: vridge 포함"

assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "apiVersion: postgresql.cnpg.io/v1" "cnpg-cluster.yaml에 올바른 apiVersion 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "kind: Cluster" "cnpg-cluster.yaml에 kind: Cluster 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "name: vridge-db" "cnpg-cluster.yaml에 name: vridge-db 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "namespace: vridge" "cnpg-cluster.yaml에 namespace: vridge 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "database: vridge" "cnpg-cluster.yaml에 database: vridge 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "owner: vridge" "cnpg-cluster.yaml에 owner: vridge 포함"
assert_contains "$ROOT_DIR/deploy/k8s/cnpg-cluster.yaml" "instances: 1" "cnpg-cluster.yaml에 instances: 1 포함"

if [ "$failures" -gt 0 ]; then
  echo "${failures}개의 검증이 실패했습니다." >&2
  exit 1
fi

echo "모든 K8s 매니페스트 검증을 통과했습니다."
