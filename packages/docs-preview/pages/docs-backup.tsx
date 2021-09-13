// imports below are used at build time only
import fs from "fs";
import path from "path";

const NEXT_PUBLIC_NAV_DATA_FILE = process.env.NEXT_PUBLIC_NAV_DATA_FILE;
const NEXT_PUBLIC_CONTENT_DIR = process.env.NEXT_PUBLIC_CONTENT_DIR;

function DocsPreviewPage({
  contentDir,
  cwd,
  navData,
}: {
  contentDir: string;
  cwd: string;
  navData: object;
}) {
  return (
    <div>
      <pre>
        <code>{JSON.stringify({ contentDir, cwd, navData }, null, 2)}</code>
      </pre>
    </div>
  );
}

export async function getStaticProps() {
  // nav data
  if (!NEXT_PUBLIC_NAV_DATA_FILE) {
    throw new Error(
      `NEXT_PUBLIC_NAV_DATA_FILE must be defined. Please ensure this environment variable points to a valid nav data file.`
    );
  }

  const navDataFile = path.resolve(NEXT_PUBLIC_NAV_DATA_FILE);
  const navData = JSON.parse(fs.readFileSync(navDataFile, "utf-8"));
  // content dir
  if (!NEXT_PUBLIC_CONTENT_DIR) {
    throw new Error(
      `NEXT_PUBLIC_CONTENT_DIR must be defined. Please ensure this environment variable points to a valid MDX content directory.`
    );
  }
  const contentDir = path.resolve(NEXT_PUBLIC_CONTENT_DIR);
  // util
  const cwd = process.cwd();
  // return props
  return { props: { contentDir, cwd, navData } };
}

export default DocsPreviewPage;
