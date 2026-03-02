const template = `apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: {{ spec.name }}-{{ environment }}
  {{#hasSidecars}}
  annotations:
    run.googleapis.com/launch-stage: BETA
  {{/hasSidecars}}
spec:
  template:
    spec:
      containers:
      - 
        name: {{ spec.primary.name }}
        image: {{{ spec.primary.image }}}:{{ version }}
        ports:
        - containerPort: {{ spec.primary.port }}
          name: http1
        env:
          - name: ENVIRONMENT
            value: {{ environment}}
          - name: SPRING_PROFILES_ACTIVE
            value: {{ environment }}
        resources:
          limits:
            cpu: 500m
            memory: 256Mi
        startupProbe:
          failureThreshold: 1
          periodSeconds: 240
          tcpSocket:
            port: {{ spec.primary.port }}
          timeoutSeconds: 240
      {{#spec.sidecars}}
      - 
        name: {{ name }}
        image: {{{ image }}}:{{ version }}
        env:
          - name: ENVIRONMENT
            value: {{ environment}}
          - name: SPRING_PROFILES_ACTIVE
            value: {{ environment }}
          - name: PORT
            value: '{{ port }}'
        resources:
          limits:
            cpu: 500m
            memory: 256Mi
      {{/spec.sidecars}}
      {{ #spec.serviceAccountName }}
      serviceAccountName: {{ spec.serviceAccountName }}
      {{ /spec.serviceAccountName }}
      timeoutSeconds: 300`

export default template