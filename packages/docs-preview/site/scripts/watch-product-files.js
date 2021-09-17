const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

// sync "content", "data", and "public" folders
syncDirs('../../data', '../data')
syncDirs('../../content', '../content')
syncDirs('../../public', '../public')

/**
 * Given paths to a source and destination directory,
 * both relative to this file, use chokidar to
 * keep the destination directory in sync with the
 * source directory.
 *
 * @param {string} sourceRelative
 * @param {string} destRelative
 */
function syncDirs(sourceRelative, destRelative) {
  const sourceDir = path.resolve(__dirname, sourceRelative)
  const destDir = path.resolve(__dirname, destRelative)
  console.log({
    sourceDir,
    destDir,
  })
  chokidar.watch(sourceDir).on('all', generateSyncHandler(sourceDir, destDir))
}

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
function generateSyncHandler(sourceDir, destinationDir) {
  return function handleSync(event, sourcePath) {
    const needsCopy = event === 'change' || event === 'add'
    const needsDelete = event === 'unlink'
    // early return if we don't need to do anything
    if (!needsCopy && !needsDelete) return
    // otherwise, handle the change, add, or unlink
    const relativePath = path.relative(sourceDir, sourcePath)
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
