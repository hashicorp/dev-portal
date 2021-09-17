const path = require('path')
const chokidar = require('chokidar')

/*
TO DO:

build a script to watch product files, specifically:
- the "content" and "data" dirs
    - all file changes should be synced into the "site" dir
- the "public" dir
    - all file changes should be synced into the "site/public" dir
*/

const publicDir = path.resolve(__dirname, '../../public')
console.log({ publicDir })
chokidar.watch(publicDir).on('all', (event, path) => {
  console.log(event, path)
})
