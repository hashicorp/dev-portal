#! /usr/bin/env bash
__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "${__dirname}" && cd ../@hashicorp/docs-preview && pwd)"
currentDir="$(pwd)"
parentDir="$(dirname "$currentDir")"
previewProduct="$(basename "$parentDir")"
NEXT_PUBLIC_CWD="$currentDir"
echo "DIRNAME:"
echo "$__dirname"
echo "PROJECTDIR:"
echo "$projectDir"
echo "CURRENTDIR:"
echo "$currentDir"
echo "PRODUCT:"
echo "$previewProduct"
cp -r "$projectDir" "$currentDir/temp-docs-preview"
cd "$currentDir/temp-docs-preview"
# Write out product-specific local env vars
# necessary for preview to work correctly
cp ".env.$previewProduct" .env.local
# Clean install and npm run dev
ls
npm ci
NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT="$previewProduct" NEXT_PUBLIC_CWD="$currentDir" npm run dev
# NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT=waypoint NEXT_PUBLIC_CWD="/Users/zachshilton/code/waypoint/website" npm run dev
