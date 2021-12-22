import { promisify } from 'util'
import { execFileSync } from 'child_process'
import path from 'path'
import fs from 'fs'

async function main() {
  // imports
  const execFile = promisify((await import('child_process')).execFile)

  // TODO: check for necessary env vars?

  const repo = process.env.REPO

  // our CWD
  const cwd = process.cwd()
  const globalCSSFile = path.join(cwd, 'src', 'pages', 'style.css')

  /**
   * Check for a .next folder, if found copy it back into our website-preview dir
   * This should allow us to take advantage of Vercel's build cache
   */
  if (fs.existsSync(path.join(cwd, '..', '.next'))) {
    console.log('.next folder found, moving into website-preview...')
    await execFile('mv', ['../.next', './.next'])

    if (fs.existsSync(path.join(cwd, '.next', 'cache', 'node_modules'))) {
      console.log('Found cached node_modules, moving...')
      await execFile('mv', ['./.next/cache/node_modules', './node_modules'])
    }
  }

  // copy public files
  console.log('📝 copying files in the public folder')
  await execFile('cp', ['-R', './public', '../'])

  /**
   * exclude any imports in the global CSS file which rely on other products
   */
  const globalCSSFileContents = await fs.promises.readFile(
    globalCSSFile,
    'utf-8'
  )

  const newContents = globalCSSFileContents
    .split('\n')
    .map((line) => {
      // comment out lines which references paths we will be removing
      if (
        !line.startsWith('/*') &&
        line.includes('_proxied-dot-io') &&
        !line.includes(repo)
      ) {
        return `/* ${line} */`
      }
      return line
    })
    .join('\n')

  console.log(`🧹 removing global CSS references for other products`)
  await fs.promises.writeFile(globalCSSFile, newContents)

  /**
   * Remove dirs in `src/pages` which are not associated with the product
   */
  const proxiedIoPagesDir = path.join(cwd, 'src', 'pages', '_proxied-dot-io')

  const proxiedIoDirs = (
    await fs.promises.readdir(proxiedIoPagesDir, { withFileTypes: true })
  ).filter((ent) => ent.isDirectory)

  for (const dir of proxiedIoDirs) {
    if (!dir.name.includes(repo)) {
      console.log(`🧹 removing pages for ${dir.name}`)
      await fs.promises.rm(path.join(proxiedIoPagesDir, dir.name), {
        recursive: true,
      })
    }
  }

  /** Install deps */
  console.log('📦 Installing dependencies')
  execFileSync('npm', ['install', '--include=dev'], { stdio: 'inherit' })

  /** Build */
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' })

  // Move the .next folder to the top-level so the site can be deployed and we can take advantage of the cache
  await execFile('cp', ['-R', '.next', '../.next'])

  // Put node_modules into .next/cache so we can retrieve them on subsequent builds
  execFileSync('mv', ['node_modules', '../.next/cache/node_modules'], {
    stdio: 'inherit',
  })
}

main()
