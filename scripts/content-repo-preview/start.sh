# Install dependencies
# TODO maybe some way to optimize this?
# TODO or just remove it if node_modules is present?
# TODO npm install seems unecessary on most runs...
# TODO but it is useful during dev.
npm i --production=false
# TODO set up watcher to sync all files
# TODO under website/public into website/website-preview/public
cp -R ../public/img/** ./public/img/
# REPO is set in each product repository's
# call to this start script
DEV_IO="$REPO" IS_CONTENT_PREVIEW=true ./node_modules/.bin/next
