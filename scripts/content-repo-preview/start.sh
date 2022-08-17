# Install dependencies
npm i --production=false
# TODO set up watcher to sync all files
# TODO under website/public into website/website-preview/public
cp -R ../public/** ./public/
# REPO is set in each product repository's
# call to this start script

# If PREVIEW_FROM_REPO is specified, run with the developer UI, else trigger the .io site UI
if [ -n "$PREVIEW_FROM_REPO" ]; then
  DEV_IO=""
  PREVIEW_FROM_REPO="$REPO"
else
  DEV_IO="$REPO"
fi

DEV_IO="$DEV_IO" PREVIEW_FROM_REPO="$PREVIEW_FROM_REPO" IS_CONTENT_PREVIEW=true ENABLE_VERSIONED_DOCS=false npm run start
