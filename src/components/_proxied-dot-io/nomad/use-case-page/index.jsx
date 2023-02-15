/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CallToAction from '@hashicorp/react-call-to-action'
import NomadEnterpriseInfo from 'components/_proxied-dot-io/nomad/enterprise-info/nomad'
import BasicHero from 'components/_proxied-dot-io/nomad/basic-hero'

export default function UseCaseLayout({ title, description, children }) {
	return (
		<div id="p-use-case">
			<BasicHero
				heading={title}
				content={description}
				links={[
					{
						text: 'Explore Tutorials',
						url: 'https://developer.hashicorp.com/nomad/tutorials',
						type: 'outbound',
					},
					{
						text: 'Explore Documentation',
						url: '/docs',
						type: 'inbound',
					},
				]}
			/>
			<div className="g-grid-container">
				<h2 className="g-type-display-2 features-header">Features</h2>
			</div>
			{children}
			<NomadEnterpriseInfo />
			<CallToAction
				variant="compact"
				heading="Ready to get started?"
				content="Nomad Open Source addresses the technical complexity of managing a mixed type of workloads in production at scale by providing a simple and flexible workload orchestrator across distributed infrastructure and clouds."
				product="nomad"
				links={[
					{
						text: 'Explore Tutorials',
						type: 'outbound',
						url: 'https://developer.hashicorp.com/nomad/tutorials',
					},
					{
						text: 'Explore Documentation',
						type: 'inbound',
						url: '/docs',
					},
				]}
			/>
		</div>
	)
}
