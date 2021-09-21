#! /usr/bin/env bash
__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "${__dirname}" && cd ../@hashicorp/docs-preview && pwd)"
currentDir="$(pwd)"
parentDir="$(dirname "$currentDir")"
previewProduct="$(basename "$parentDir")"
previewDir="$currentDir/docs-preview"
NEXT_PUBLIC_CWD="$currentDir"
# echo "__dirname: $__dirname"
# echo "projectDir: $projectDir"
# echo "currentDir: $currentDir"
# echo "previewProduct: $previewProduct"
# Copy site source into working directory
args=("$@")
echo $# arguments passed
echo ${args[0]} ${args[1]} ${args[2]}
cp -R "$projectDir/site/." "$previewDir"
# Copy content files into site source directory
cp -R "$currentDir/content" "$previewDir/content"
cp -R "$currentDir/data" "$previewDir/data"
cp -R "$currentDir/public/." "$previewDir/public"
# cd into the site source directory,
# and prep to start the preview
cd "$previewDir"
# Write out product-specific files
# necessary for preview to work correctly
cp "./site-specific/.env.$previewProduct" .env.local
cp "./site-specific/redirects.$previewProduct.js" redirects.js
# Clean install
npm ci
# Copy public assets from source repo into the
# working Next.js directory
cp -r "../public/." "./public/"
cp -r "../data/." "./data/"
cp -r "../content/." "./content/"
# run build, or dev
if [ "${args[0]}" = "build" ]; then
    echo "running build for vercel"
    npm run static
else
    echo "running start script"
    npm run dev
fi
# NEXT_PUBLIC_ALGOLIA_APP_ID=YY0FFNI7MF NEXT_PUBLIC_ALGOLIA_INDEX=product_WAYPOINT NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY=5e4adfd8094367056501547d6fedb6c5 NEXT_PUBLIC_CWD="/Users/zachshilton/code/waypoint/website" npm run dev
