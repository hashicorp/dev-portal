import Head from 'next/head'

function TestPageWithTwitterDescription() {
  return (
    <>
      <Head>
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="og:title" content="Test With Twitter Description" />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          property="og:description"
          content="This is the og:description for a test page with twitter description."
        />
        <meta
          name="twitter:description"
          content="This is the twitter:description for a test page with twitter description."
        />
        <meta
          property="og:image"
          content="https://www.datocms-assets.com/2885/1655303762-16_9-social-image-homepage.jpg?fit=max&amp;fm=jpg&amp;w=1000"
        ></meta>
      </Head>
      <p>
        Hello! This page has <code>twitter:description</code>, as well as an{' '}
        <code>og:description</code>. They have unique text.
      </p>
    </>
  )
}

export default TestPageWithTwitterDescription
