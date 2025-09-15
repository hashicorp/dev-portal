# Sandbox Authoring Guide

This guide explains how to update HashiCorp sandbox configuration and tokens for the dev-portal project.

## Where to Update Sandbox Track Paths and Scenarios

- Edit `src/content/sandbox/sandbox.json`
- Update the `instruqtTrack` field for each sandbox to change the track path.
- Update the `scenario` field if you need to change the scenario for a sandbox.
- If you add a new sandbox, make sure to update both sandbox.json and `getDefaultTokens`.

Example:

```json
{
	"labs": [
		{
			"title": "Terraform Sandbox",
			"instruqtTrack": "hashicorp-learn/tracks/terraform-sandbox",
			"scenario": "default"
		}
		// ...other labs
	]
}
```

## Where to Update Sandbox Tokens

- Edit the `getDefaultTokens` function in `src/lib/build-instruqt-url.ts`
- Tokens are public and scoped to each sandbox scenario. You can update them directly in this function.

Example:

```typescript
const getDefaultTokens = (): InstruqtTokens => ({
	'terraform-sandbox': 'em_3vgTsBqCLq2blqtQ',
	// ...other tokens
})
```

## Summary

- Track paths and scenarios: `sandbox.json`
- Tokens: `build-instruqt-url.ts`
