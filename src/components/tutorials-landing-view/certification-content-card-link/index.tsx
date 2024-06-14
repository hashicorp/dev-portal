/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { trackCertificationCardLinkClicked } from 'views/tutorials-landing/analytics'
import { type CertificationContentCardLinkProps } from '../types'
import ContentCardLink from '../content-card-link'
import infrastructionAutomationGraphic from './img/terraform.svg'
import securityAutomationGraphic from './img/vault.svg'

const CERTIFICATION_PROGRAM_SLUGS_TO_BACKGROUND_IMAGES = {
	'infrastructure-automation': {
		url: infrastructionAutomationGraphic,
		lightOrDark: 'dark',
	},
	'security-automation': {
		url: securityAutomationGraphic,
		lightOrDark: 'light',
	},
}

const CertificationContentCardLink = ({
	certification,
	product,
}: CertificationContentCardLinkProps) => {
	const { url, lightOrDark } =
		CERTIFICATION_PROGRAM_SLUGS_TO_BACKGROUND_IMAGES[certification.slug]
	const title = certification.title
	const description = certification.description
	/**
	 * Special case for the consul certification to link to it's specfic header
	 * {@link https://developer.hashicorp.com/certifications/security-automation#consul-associate-(003)-details}
	 */
	const baseHref = `/certifications/${certification.slug}`
	const href =
		product.name === 'Consul'
			? `${baseHref}#consul-associate-(003)-details`
			: baseHref

	const handleClick = () => {
		trackCertificationCardLinkClicked({
			linkPath: baseHref,
			productSlug: product.slug,
		})
	}

	return (
		<ContentCardLink
			backgroundImageColor={lightOrDark}
			backgroundImageUrl={url}
			description={description}
			href={href}
			title={title}
			onClick={handleClick}
		/>
	)
}

export default CertificationContentCardLink
