JSON_REFS := ./node_modules/json-refs/bin/json-refs

spec: deps
	${JSON_REFS} resolve ./spec/_index.yaml > ./analytics_tracking_plan.json

deps:
	npm i

.PHONY: spec deps
