const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

// sync the "data" folder outside the site
// with the "data" folder within it
const dataSourceDir = path.resolve(__dirname, '../../data')
const dataDestDir = path.resolve(__dirname, '../data')
chokidar.watch(dataSourceDir).on('all', generateSyncHandler(dataDestDir))

// sync the "content" folder outside the site
// with the "content" folder within it
const contentSourceDir = path.resolve(__dirname, '../../content')
const contentDestDir = path.resolve(__dirname, '../content')
chokidar.watch(contentSourceDir).on('all', generateSyncHandler(contentDestDir))

// sync the "public" folder outside the site
// with the "public" folder within it
const publicSourceDir = path.resolve(__dirname, '../../public')
const publicDestDir = path.resolve(__dirname, '../public')
chokidar.watch(publicSourceDir).on('all', generateSyncHandler(publicDestDir))

console.log({
  dataSourceDir,
  dataDestDir,
  contentSourceDir,
  contentDestDir,
  publicSourceDir,
  publicDestDir,
})

/**
 * Given an absolute path to destination directory,
 * return a function (event, sourcePath) => null
 * suitable for use with chokidar.watch().on()
 *
 * For example:
 * const syncHandler = generateSyncHandler(destDir)
 * chokidar.watch(sourceDir).on("all", syncHandler)
 *
 * @param {string} destinationDir
 * @returns
 */
function generateSyncHandler(destinationDir) {
  return function handleSync(event, sourcePath) {
    const needsCopy = event === 'change' || event === 'add'
    const needsDelete = event === 'unlink'
    // early return if we don't need to do anything
    if (!needsCopy && !needsDelete) return
    // otherwise, handle the change, add, or unlink
    const relativePath = path.relative(dataDir, sourcePath)
    const destinationPath = path.join(destinationDir, relativePath)
    if (needsCopy) {
      // for changes or additions, copy the updated source file
      fs.copyFileSync(sourcePath, destinationPath)
    } else if (needsDelete) {
      // for deletions, delete the destination file
      fs.unlinkSync(destinationPath)
    }
  }
}
