# Delete cached .next, if present
# TODO: would be nice to leverage caching,
# TODO: deleted for now as it makes debugging harder
cd ..
echo "Files before .next cache delete:"
ls -a
# echo "Deleting .next cache..."
# rm -rf .next
# echo "Done"
# Change into the website preview directory
cd ./website-preview
# Merge the local public folder
# into the dev-portal public folder
cp -R ../public/* ./public/
# Install dependencies
npm i --production=false
# Delete other products' docs pages,
# these will just increase build times
# Make a temporary directory for global CSS files
mkdir ./temp-global-page-css
# Boundary
if [ "$REPO" != "boundary" ]; then
    # Preserve page CSS files, otherwise global.css imports will break build
    mv ./src/pages/_proxied-dot-io/boundary/home/style.css ./temp-global-page-css/boundary-home.css
    # Delete all boundary dot-io pages
    rm -rf ./src/pages/_proxied-dot-io/boundary
    # Put the page CSS files back
    mkdir ./src/pages/_proxied-dot-io/boundary
    mkdir ./src/pages/_proxied-dot-io/boundary/home
    mv ./temp-global-page-css/boundary-home.css ./src/pages/_proxied-dot-io/boundary/home/style.css
fi
# Sentinel
if [ "$REPO" != "sentinel" ]; then
    # Delete all sentinel dot-io pages
    rm -rf ./src/pages/_proxied-dot-io/sentinel
fi
# Waypoint
if [ "$REPO" != "waypoint" ]; then
    # Delete all waypoint dot-io pages
    rm -rf ./src/pages/_proxied-dot-io/waypoint
fi
# Build the site.
# Note that DEV_IO and IS_CONTENT_PREVIEW are set
# in Vercel configuration for the project.
# (Those env vars are used both for next build,
# and in error pages at request time, so Vercel
# configuration seemed like the logical place)
npm run build
# Copy .next build output folder into project root,
# so that Vercel's NextJS preset picks up on the build output
echo "Listing files after build..."
ls -a
echo "Copying .next output to project root..."
if [ ! -d "../.next" ]; then
    mkdir ../.next
fi
cp -R .next/* ../.next/
echo "Done."
