#! /usr/bin/env bash
__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "${__dirname}" && cd ../@hashicorp/docs-preview && pwd)"
currentDir="$(pwd)"
parentDir="$(dirname "$currentDir")"
previewProduct="$(basename "$parentDir")"
NEXT_PUBLIC_CWD="$currentDir"
# echo "__dirname: $__dirname"
# echo "projectDir: $projectDir"
# echo "currentDir: $currentDir"
# echo "previewProduct: $previewProduct"
# Copy site source into working directory
cp -R "$projectDir/site/." "$currentDir/docs-preview"
cd "$currentDir/docs-preview"
# Rename .gitignore for consumer
# so that it becomes effective
# mv gitignore-consumer .gitignore
# Write out product-specific files
# necessary for preview to work correctly
cp "./site-specific/.env.$previewProduct" .env.local
cp "./site-specific/redirects.$previewProduct.js" redirects.js
# Clean install
npm ci
# Copy public assets from source repo into the
# working Next.js directory
cp -r "./assets/." "./public/"
# Run next dev
npm run dev
# NEXT_PUBLIC_ALGOLIA_APP_ID=YY0FFNI7MF NEXT_PUBLIC_ALGOLIA_INDEX=product_WAYPOINT NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY=5e4adfd8094367056501547d6fedb6c5 NEXT_PUBLIC_CWD="/Users/zachshilton/code/waypoint/website" npm run dev
