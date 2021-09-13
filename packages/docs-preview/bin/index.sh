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
# Write out Algolia env vars
if [ "$previewProduct" = "waypoint" ]; then
    echo "is waypoint"
    printf "NEXT_PUBLIC_ALGOLIA_APP_ID=YY0FFNI7MF\nNEXT_PUBLIC_ALGOLIA_INDEX=product_WAYPOINT\nNEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY=5e4adfd8094367056501547d6fedb6c5\n" >".env.local"
elif [ "$previewProduct" = "consul" ]; then
    echo "is consul"
    printf "NEXT_PUBLIC_SEGMENT_WRITE_KEY='IyzLrqXkox5KJ8XL4fo8vTYNGfiKlTCm'\nNEXT_PUBLIC_BUGSNAG_CLIENT_KEY='01625078d856ef022c88f0c78d2364f1'\nNEXT_PUBLIC_BUGSNAG_SERVER_KEY='be8ed0d0fc887d547284cce9e98e60e5'\nNEXT_PUBLIC_ALGOLIA_APP_ID=YY0FFNI7MF\nNEXT_PUBLIC_ALGOLIA_INDEX=product_CONSUL\nNEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY=fbd5dc1f0078d41509fcc560386fd534\n" >".env.local"
else
    echo "unknown product"
fi
# Clean install and npm run dev
ls
npm ci
NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT="$previewProduct" NEXT_PUBLIC_CWD="$currentDir" npm run dev
# NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT=waypoint NEXT_PUBLIC_CWD="/Users/zachshilton/code/waypoint/website" npm run dev
