import Document, { Html, Head, Main, NextScript } from 'next/document'
import HashiHead from '@hashicorp/react-head'
// import Script from 'next/script'
// import { datadogScriptBody } from 'lib/datadog'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <HashiHead />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* <Script
            id="datadog-script-id"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: datadogScriptBody,
            }}
          /> */}
          <script
            noModule
            dangerouslySetInnerHTML={{
              __html: `window.MSInputMethodContext && document.documentMode && document.write('<script src="/ie-warning.js"><\\x2fscript>');`,
            }}
          />
        </body>
      </Html>
    )
  }
}
