{{- define "vridge.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "vridge.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := include "vridge.name" . -}}
{{- if eq .Release.Name $name -}}
{{- $name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "vridge.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "vridge.selectorLabels" -}}
app.kubernetes.io/name: {{ include "vridge.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "vridge.labels" -}}
helm.sh/chart: {{ include "vridge.chart" . }}
{{ include "vridge.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/component: web
{{- end -}}

{{- define "vridge.probe" -}}
{{- $probeName := .probeName -}}
{{- $probeValues := .probeValues -}}
{{- if $probeValues.enabled }}
{{ $probeName }}:
  httpGet:
    path: {{ $probeValues.path }}
    port: http
  initialDelaySeconds: {{ $probeValues.initialDelaySeconds }}
  periodSeconds: {{ $probeValues.periodSeconds }}
  timeoutSeconds: {{ $probeValues.timeoutSeconds }}
  failureThreshold: {{ $probeValues.failureThreshold }}
{{- end -}}
{{- end -}}
