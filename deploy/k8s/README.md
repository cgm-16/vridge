# vridge Kubernetes 매니페스트

이 디렉터리에는 vridge 애플리케이션의 네임스페이스 및 CloudNativePG(CNPG) 클러스터 매니페스트가 포함되어 있습니다.

## 파일 목록

| 파일 | 설명 |
| --- | --- |
| `namespace.yaml` | `vridge` 네임스페이스 정의 |
| `cnpg-cluster.yaml` | CNPG PostgreSQL 클러스터 (`vridge-db`) 정의 |

## 적용 순서

네임스페이스를 먼저 적용한 뒤 클러스터를 적용해야 합니다.

```sh
kubectl apply -f deploy/k8s/namespace.yaml
kubectl apply -f deploy/k8s/cnpg-cluster.yaml
```

## CNPG 자동 생성 시크릿

CNPG는 클러스터가 준비되면 `vridge-db-app` 시크릿을 자동으로 생성합니다. 이 시크릿은 `bootstrap.initdb`에 지정한 `owner`/`database` 쌍을 기반으로 만들어지며 다음 키를 포함합니다.

| 키 | 설명 |
| --- | --- |
| `uri` | PostgreSQL 연결 URI (`postgresql://...`) |
| `jdbc-uri` | JDBC 형식 연결 문자열 |
| `pgpass` | pgpass 파일 형식 자격증명 |
| `password` | 데이터베이스 사용자 비밀번호 |
| `username` | 데이터베이스 사용자 이름 |

vridge Helm 차트는 `vridge-db-app:uri` 키를 `DATABASE_URL` 및 `DIRECT_URL` 환경변수에 주입합니다.

## 클러스터 준비 상태 확인

```sh
kubectl get cluster vridge-db -n vridge
```

`STATUS` 컬럼이 `Cluster in healthy state`로 표시되면 준비된 것입니다.

## 시크릿 생성 확인

```sh
kubectl get secret vridge-db-app -n vridge
```

## 스토리지 주의사항

k3s의 기본 스토리지 클래스인 `local-path`는 **볼륨 확장을 지원하지 않습니다.** 현재 `storage.size`는 `1Gi`로 설정되어 있습니다. 운영 환경에 맞게 초기 크기를 충분히 설정하거나, 볼륨 확장을 지원하는 스토리지 클래스를 `storage.storageClass`에 명시하세요.

## 추후 작업 (현재 미포함)

- **백업**: `ScheduledBackup` 리소스는 별도 태스크에서 추가할 예정입니다.
- **PgBouncer**: 현재 배포 범위에는 포함하지 않습니다. 필요 시 별도 태스크에서 추가합니다.
- **postgresql.parameters**: 현재는 CNPG 기본값을 사용합니다. 운영 부하를 관찰한 뒤 필요시 조정합니다.
