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
echo "cp -r \"$projectDir/site/\" \"$currentDir\"/"
# rm -rf "$projectDir/node_modules"
cp -r "$projectDir/site" "$currentDir"
# Write out product-specific local env vars
# necessary for preview to work correctly
cp ".env.$previewProduct" .env.local
# Clean install
# npm ci
# Copy public assets from source repo into the
# working Next.js directory
# cp -r "../public/img" "./public"
# Run next dev
# NEXT_PUBLIC_CWD="$currentDir" npm run dev
# NEXT_PUBLIC_ALGOLIA_APP_ID=YY0FFNI7MF NEXT_PUBLIC_ALGOLIA_INDEX=product_WAYPOINT NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY=5e4adfd8094367056501547d6fedb6c5 NEXT_PUBLIC_CWD="/Users/zachshilton/code/waypoint/website" npm run dev
