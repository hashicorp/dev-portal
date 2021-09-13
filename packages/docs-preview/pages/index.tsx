import Link from 'next/link'
import path from 'path'

const NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT =
  process.env.NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT
const NEXT_PUBLIC_CWD = process.env.NEXT_PUBLIC_CWD
const NAV_DATA_FILE = 'data/docs-nav-data.json'
const CONTENT_DIR = 'content/docs'

function Home({
  navDataFile,
  localContentDir,
}: {
  navDataFile: string
  localContentDir: string
}) {
  return (
    <div>
      <Link href="/docs">
        <a>/docs</a>
      </Link>
      <pre>
        <code>
          {JSON.stringify(
            {
              NEXT_PUBLIC_DOCS_PREVIEW_PRODUCT,
              NEXT_PUBLIC_CWD,
              navDataFile,
              localContentDir,
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  )
}

function getRelativePathFromCwd(pathFromProduct) {
  const absolutePath = path.join(NEXT_PUBLIC_CWD, pathFromProduct)
  return path.relative(process.cwd(), absolutePath)
}

export async function getStaticProps() {
  const navDataFile = getRelativePathFromCwd(NAV_DATA_FILE)
  const localContentDir = getRelativePathFromCwd(CONTENT_DIR)
  return { props: { navDataFile, localContentDir } }
}

export default Home
