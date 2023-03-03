/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Document, { Html, Head, Main, NextScript } from 'next/document'
import HashiHead from '@hashicorp/react-head'
import { SegmentPreloadScript } from '@hashicorp/react-consent-manager/scripts/segment'

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
					<SegmentPreloadScript />
					<Main />
					<NextScript />
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
