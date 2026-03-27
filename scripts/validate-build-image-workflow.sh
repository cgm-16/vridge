#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
WORKFLOW_PATH="$ROOT_DIR/.github/workflows/build-image.yml"

if [ ! -f "$WORKFLOW_PATH" ]; then
  echo "이미지 빌드 워크플로우 파일이 없습니다: .github/workflows/build-image.yml" >&2
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

assert_contains '^[[:space:]]*name: Build Image$' "워크플로우 이름이 Build Image가 아닙니다."
assert_contains '^[[:space:]]*push:$' "워크플로우가 push 트리거를 정의하지 않았습니다."
assert_contains '^[[:space:]]*-[[:space:]]dev$' "워크플로우가 dev 브랜치 push를 트리거하지 않습니다."
assert_contains '^[[:space:]]*-[[:space:]]production$' "워크플로우가 production 브랜치 push를 트리거하지 않습니다."
assert_contains '^[[:space:]]*workflow_dispatch:$' "워크플로우에 workflow_dispatch 트리거가 없습니다."
assert_contains '^[[:space:]]*contents:[[:space:]]*read$' "워크플로우 권한에 contents: read가 없습니다."
assert_contains '^[[:space:]]*packages:[[:space:]]*write$' "워크플로우 권한에 packages: write가 없습니다."
assert_contains '^[[:space:]]*REGISTRY:[[:space:]]*ghcr\.io$' "워크플로우가 GHCR 레지스트리를 사용하지 않습니다."
assert_contains 'docker/setup-buildx-action@v4' "워크플로우에 docker/setup-buildx-action이 없습니다."
assert_contains 'docker/login-action@v4' "워크플로우에 docker/login-action이 없습니다."
assert_contains 'docker/metadata-action@v6' "워크플로우에 docker/metadata-action이 없습니다."
assert_contains 'docker/build-push-action@v7' "워크플로우에 docker/build-push-action이 없습니다."
assert_contains '^[[:space:]]*images:[[:space:]]*\$\{\{ env\.REGISTRY \}\}/\$\{\{ env\.IMAGE_NAME \}\}$' "메타데이터 액션이 REGISTRY/IMAGE_NAME 기반 이미지를 사용하지 않습니다."
assert_contains '^[[:space:]]*type=ref,event=branch$' "브랜치 태그 규칙이 없습니다."
assert_contains '^[[:space:]]*type=sha,format=long,prefix=sha-$' "커밋 SHA 태그 규칙이 없습니다."
assert_contains '^[[:space:]]*context:[[:space:]]*\.$' "빌드 컨텍스트가 루트 디렉터리가 아닙니다."
assert_contains '^[[:space:]]*file:[[:space:]]*\./Dockerfile$' "워크플로우가 루트 Dockerfile을 사용하지 않습니다."
assert_contains '^[[:space:]]*push:[[:space:]]*true$' "워크플로우가 이미지를 push하지 않습니다."
assert_contains '^[[:space:]]*cache-from:[[:space:]]*type=gha$' "워크플로우가 GitHub Actions 캐시를 사용하지 않습니다."
assert_contains '^[[:space:]]*cache-to:[[:space:]]*type=gha,mode=max$' "워크플로우가 GitHub Actions 캐시 저장을 설정하지 않았습니다."
assert_contains '^[[:space:]]*NEXT_PUBLIC_APP_URL=\$\{\{ env\.NEXT_PUBLIC_APP_URL \}\}$' "NEXT_PUBLIC_APP_URL 빌드 인자가 없습니다."
assert_contains '^[[:space:]]*NEXT_PUBLIC_GA_MEASUREMENT_ID=\$\{\{ env\.NEXT_PUBLIC_GA_MEASUREMENT_ID \}\}$' "NEXT_PUBLIC_GA_MEASUREMENT_ID 빌드 인자가 없습니다."
assert_contains '^[[:space:]]*NEXT_PUBLIC_PRIVACY_POLICY_URL=\$\{\{ env\.NEXT_PUBLIC_PRIVACY_POLICY_URL \}\}$' "NEXT_PUBLIC_PRIVACY_POLICY_URL 빌드 인자가 없습니다."
