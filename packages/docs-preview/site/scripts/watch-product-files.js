const chokidar = require('chokidar')
/*
TO DO:

build a script to watch product files, specifically:
- the "content" and "data" dirs
    - all file changes should be synced into the "site" dir
- the "public" dir
    - all file changes should be synced into the "site/public" dir
*/

console.log(
  'TO DO: this Node script should be running a watcher at the same time as our dev script, but right now, it does nothing.'
)

chokidar.watch('../public').on('all', (event, path) => {
  console.log(event, path)
})
