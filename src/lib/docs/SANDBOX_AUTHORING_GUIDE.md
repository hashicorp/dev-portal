# Sandbox Authoring Guide

This guide explains how to update HashiCorp sandbox configuration for the dev-portal project.

## Where to Update Sandbox Configuration

All sandbox configuration is managed in a single file: `src/content/sandbox/sandbox.json`

For each sandbox lab, you can configure:
- The `instruqtTrack` field with both the track path and token
- The `scenario` field if you need a specific scenario

Example:

```json
{
  "labs": [
    {
      "title": "Terraform Sandbox",
      "description": "A comprehensive Terraform sandbox environment for learning",
      "products": ["terraform"],
      "labId": "terraform-sandbox",
      "instruqtTrack": "hashicorp-learn/tracks/terraform-sandbox?token=em_3vgTsBqCLq2blqtQ",
      "documentation": "terraform.mdx"
    },
    {
      "title": "Consul Sandbox (Service discovery)",
      "products": ["consul"],
      "labId": "consul-service-discovery-sandbox",
      "instruqtTrack": "hashicorp-learn/tracks/consul-sandbox-sd?token=em_MdAn4Od_foU6oybz",
      "scenario": "SD",
      "documentation": "consul-sd.mdx"
    }
  ]
}
```

## Field Descriptions

- `title`: Display name for the lab
- `description`: Brief description of what the lab provides
- `products`: Array of product slugs this lab supports (must be listed in the global products array)
- `labId`: Unique identifier for the lab
- `instruqtTrack`: Full Instruqt track path including the token (e.g., `hashicorp-learn/tracks/terraform-sandbox?token=em_xyz`)
- `scenario`: (Optional) Specific scenario to load for this lab
- `documentation`: (Optional) Path to MDX documentation file

## Notes

- Tokens are public and scoped to each sandbox scenario
- Include the token directly in the `instruqtTrack` URL using the `?token=` parameter
- If a scenario is specified, it will be automatically appended to the URL
