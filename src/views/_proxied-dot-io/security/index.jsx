/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import HashiHead from '@hashicorp/react-head'
import LongformPage from 'components/longform-page'

function SecurityPage({ productName, githubUrl }) {
	const title = `Security | ${productName} by HashiCorp`
	const description = `${productName} takes security very seriously. Please responsibly disclose any security
    vulnerabilities found and we'll handle it quickly.`
	return (
		<>
			<HashiHead title={title} pageName={title} description={description} />
			<LongformPage title="Security" className="security" alert="">
				<p>
					We understand that many users place a high level of trust in HashiCorp
					and the tools we build. We apply best practices and focus on security
					to make sure we can maintain the trust of the community.
				</p>
				<p>
					We deeply appreciate any effort to disclose vulnerabilities
					responsibly.
				</p>
				<p>
					If you would like to report a vulnerability, please see the{' '}
					<a href="https://www.hashicorp.com/security">
						HashiCorp security page
					</a>{' '}
					which has the proper email to communicate with as well as our PGP key.
				</p>
				<p>
					{' '}
					If you aren&apos;t reporting a security sensitive vulnerability,
					please open an issue on the standard <a href={githubUrl}>
						GitHub
					</a>{' '}
					repository.
				</p>
			</LongformPage>
		</>
	)
}

export default SecurityPage
