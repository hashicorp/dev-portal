const path = require('path')
const chokidar = require('chokidar')

const dataDir = path.resolve(__dirname, '../../data')
const contentDir = path.resolve(__dirname, '../../content')
const publicDir = path.resolve(__dirname, '../../public')
console.log({ dataDir, contentDir, publicDir })
/*
TO DO:

build a script to watch product files, specifically:
- the "content" and "data" dirs
    - all file changes should be synced into the "site" dir
- the "public" dir
    - all file changes should be synced into the "site/public" dir
*/

chokidar.watch(dataDir).on('all', (event, path) => {
  if (event === 'change') console.log(event, path)
})

chokidar.watch(contentDir).on('all', (event, path) => {
  if (event === 'change') console.log(event, path)
})

chokidar.watch(publicDir).on('all', (event, path) => {
  if (event === 'change') console.log(event, path)
})
