# Install dependencies
npm i --production=false
# TODO set up watcher to sync all files
# TODO under website/public into website/website-preview/public
cp -R ../public/** ./public/
# REPO is set in each product repository's
# call to this start script
DEV_IO="$REPO" IS_CONTENT_PREVIEW=true ENABLE_VERSIONED_DOCS=false npm run start
