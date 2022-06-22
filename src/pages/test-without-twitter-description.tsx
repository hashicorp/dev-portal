import Head from 'next/head'

function TestPageWithoutTwitterDescription() {
  return (
    <>
      <Head>
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:title" content="Test Without Twitter Description" />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          property="og:description"
          content="This is the og:description for a test page without twitter description."
        />
      </Head>
      <p>
        Hello! This page only has an <code>og:description</code>.
      </p>
    </>
  )
}

export default TestPageWithoutTwitterDescription
