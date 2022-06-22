import Head from 'next/head'

function TestPageWithTwitterDescription() {
  return (
    <>
      <Head>
        <meta
          name="description"
          property="og:description"
          content="This is the og:description for a test page."
        />
        <meta
          name="twitter:description"
          content="This is the twitter:description for a test page."
        />
      </Head>
      <p>
        Hello! This page has <code>twitter:description</code>, as well as an{' '}
        <code>og:description</code>. They have unique text.
      </p>
    </>
  )
}

export default TestPageWithTwitterDescription
