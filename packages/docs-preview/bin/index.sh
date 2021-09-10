#! /usr/bin/env bash
__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
projectDir="$(cd "${__dirname}" && cd ../@hashicorp/docs-preview && pwd)"
currentDir="$(pwd)"
echo "DIRNAME:"
echo "$__dirname"
echo "PROJECTDIR:"
echo "$projectDir"
echo "CURRENTDIR:"
echo "$currentDir"
cp -r "$projectDir" "$currentDir/temp-docs-preview"
cd "$currentDir/temp-docs-preview"
npm i && npm run dev
