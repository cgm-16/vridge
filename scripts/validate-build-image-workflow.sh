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

assert_contains '^name: Build Image$' "워크플로우 이름이 Build Image가 아닙니다."
assert_contains '^  push:$' "워크플로우가 push 트리거를 정의하지 않았습니다."
assert_contains '^      - dev$' "워크플로우가 dev 브랜치 push를 트리거하지 않습니다."
assert_contains '^  workflow_dispatch:$' "워크플로우에 workflow_dispatch 트리거가 없습니다."
assert_contains '^  contents: read$' "워크플로우 권한에 contents: read가 없습니다."
assert_contains '^  packages: write$' "워크플로우 권한에 packages: write가 없습니다."
assert_contains '^  REGISTRY: ghcr\.io$' "워크플로우가 GHCR 레지스트리를 사용하지 않습니다."
assert_contains 'docker/setup-buildx-action@v3' "워크플로우에 docker/setup-buildx-action이 없습니다."
assert_contains 'docker/login-action@v3' "워크플로우에 docker/login-action이 없습니다."
assert_contains 'docker/metadata-action@v5' "워크플로우에 docker/metadata-action이 없습니다."
assert_contains 'docker/build-push-action@v6' "워크플로우에 docker/build-push-action이 없습니다."
assert_contains '^          images: \$\{\{ env\.REGISTRY \}\}/\$\{\{ env\.IMAGE_NAME \}\}$' "메타데이터 액션이 REGISTRY/IMAGE_NAME 기반 이미지를 사용하지 않습니다."
assert_contains '^            type=ref,event=branch$' "브랜치 태그 규칙이 없습니다."
assert_contains '^            type=sha,format=long,prefix=sha-$' "커밋 SHA 태그 규칙이 없습니다."
assert_contains '^          context: \.$' "빌드 컨텍스트가 루트 디렉터리가 아닙니다."
assert_contains '^          file: \./Dockerfile$' "워크플로우가 루트 Dockerfile을 사용하지 않습니다."
assert_contains '^          push: true$' "워크플로우가 이미지를 push하지 않습니다."
assert_contains '^          cache-from: type=gha$' "워크플로우가 GitHub Actions 캐시를 사용하지 않습니다."
assert_contains '^          cache-to: type=gha,mode=max$' "워크플로우가 GitHub Actions 캐시 저장을 설정하지 않았습니다."
assert_contains '^            NEXT_PUBLIC_APP_URL=\$\{\{ env\.NEXT_PUBLIC_APP_URL \}\}$' "NEXT_PUBLIC_APP_URL 빌드 인자가 없습니다."
assert_contains '^            NEXT_PUBLIC_GA_MEASUREMENT_ID=\$\{\{ env\.NEXT_PUBLIC_GA_MEASUREMENT_ID \}\}$' "NEXT_PUBLIC_GA_MEASUREMENT_ID 빌드 인자가 없습니다."
assert_contains '^            NEXT_PUBLIC_PRIVACY_POLICY_URL=\$\{\{ env\.NEXT_PUBLIC_PRIVACY_POLICY_URL \}\}$' "NEXT_PUBLIC_PRIVACY_POLICY_URL 빌드 인자가 없습니다."
