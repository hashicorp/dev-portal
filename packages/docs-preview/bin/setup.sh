#! /usr/bin/env bash
echo "fetching local preview website source..."
if [ "$1" = "build" ]; then
    echo "(will build for vercel once setup is complete)"
else
    echo "(will run local preview once setup is complete)"
fi
__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "${__dirname}" && cd ../@hashicorp/docs-preview && pwd)"
currentDir="$(pwd)"
parentDir="$(dirname "$currentDir")"
previewProduct="$(basename "$parentDir")"
previewDir="$currentDir/docs-preview"
NEXT_PUBLIC_CWD="$currentDir"
# Copy site source into working directory
cp -R "$projectDir/site/." "$previewDir"
# cd into the site source directory,
# and finish setting up the nextjs app directory
cd "$previewDir"
# CI-style install
# (not yet installed via npx, since our
# @hashicorp/docs-preview package has
# a nested site folder and package.json
# for the NextJS preview app.)
npm ci
# Write out product-specific files
# necessary for preview to work as expected
cp "./site-specific/.env.$previewProduct" .env.local
cp "./site-specific/redirects.$previewProduct.js" redirects.js
# Copy files into the working Next.js directory
# (`npm run dev` script includes a watcher that
# will keep these files synced)
cp -R "$currentDir/content" "$previewDir/content"
cp -R "$currentDir/data" "$previewDir/data"
cp -R "$currentDir/public/." "$previewDir/public"
# Run local dev preview by default,
# but also allow and arg to be passed to
# run a static export (trying this for PR deploy previews)
if [ "$1" = "build" ]; then
    echo "starting build for vercel deployment..."
    npm run static
else
    echo "starting local preview..."
    npm run dev
fi
