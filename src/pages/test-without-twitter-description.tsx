import Head from 'next/head'

function TestPageWithoutTwitterDescription() {
  return (
    <>
      <Head>
        <meta
          name="description"
          property="og:description"
          content="This is the og:description for a test page."
        />
      </Head>
      <p>
        Hello! This page only has an <code>og:description</code>.
      </p>
    </>
  )
}

export default TestPageWithoutTwitterDescription
