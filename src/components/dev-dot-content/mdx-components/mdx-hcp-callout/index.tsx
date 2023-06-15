/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/legacy/image'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import { HcpProductSlug, ProductName } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import { HCPCalloutProps, SolutionOption } from './types'
import patternApplications from './img/applications.svg'
import patternInfrastructure from './img/infrastructure.svg'
import patternNetworking from './img/networking.svg'
import patternSecurity from './img/security.svg'
import s from './mdx-callout.module.css'

const SOLUTION_PRODUCTS_MAP: Record<
	SolutionOption,
	(HcpProductSlug | 'vault-secrets')[]
> = {
	applications: ['waypoint'],
	infrastructure: ['packer'],
	networking: ['consul'],
	security: ['boundary', 'vault', 'vault-secrets'],
}

const SOLUTION_DETAILS: Record<
	SolutionOption,
	{
		gradient: string
		image: string
	}
> = {
	applications: {
		gradient: '--wpl-gradient-applications-horizontal',
		image: patternApplications,
	},
	infrastructure: {
		gradient: '--wpl-gradient-infrastructure-horizontal',
		image: patternInfrastructure,
	},
	networking: {
		gradient: '--wpl-gradient-networking-horizontal',
		image: patternNetworking,
	},
	security: {
		gradient: '--wpl-gradient-security-horizontal',
		image: patternSecurity,
	},
}

const HCP_VAULT_SECRETS = 'HCP Vault Secrets'

export default function HCPCallout({
	product,
}: HCPCalloutProps & { product: 'vault-secrets' }) {
	// TODO(kevinwang): Clean this up someday.
	//
	// I'm injecting "vault-secrets" here to avoid changing
	// `productSlugsToNames` which has run-time implications elsewhere
	const productName =
		product === 'vault-secrets'
			? HCP_VAULT_SECRETS
			: productSlugsToNames[product]
	const solution = Object.keys(SOLUTION_PRODUCTS_MAP).find(
		(group: SolutionOption) => SOLUTION_PRODUCTS_MAP[group].includes(product)
	)
	const { gradient, image } = SOLUTION_DETAILS[solution]

	return (
		<div
			className={s.root}
			style={
				{
					'--gradient': `var(${gradient})`,
				} as React.CSSProperties
			}
		>
			<div className={s.textContainer}>
				<>{getHeadingText(productName)}</>
				<>{getSubHeadingText(productName)}</>
				<>{getLinkText(productName, product)}</>
			</div>
			<div className={s.solutionPattern}>
				<Image
					src={image}
					/** Note: pattern image is purely decorative */
					alt=""
					layout="fill"
					objectFit="cover"
					objectPosition="center"
				/>
			</div>
		</div>
	)
}

function getHeadingText(productName: ProductName) {
	if (productName === HCP_VAULT_SECRETS) {
		return (
			<Text asElement="p" weight="bold" className={s.heading}>
				<span className={s.solutionGradient}>{productName}</span>
			</Text>
		)
	}

	return (
		<Text asElement="p" weight="bold" className={s.heading}>
			Looking for <span className={s.solutionGradient}>{productName}</span>{' '}
			fundamentals?
		</Text>
	)
}

function getSubHeadingText(productName: ProductName) {
	if (productName === HCP_VAULT_SECRETS) {
		return (
			<Text asElement="p" size={200} className={s.subHeading}>
				Centralized secrets lifecycle management for developers.
			</Text>
		)
	}

	return (
		<Text asElement="p" size={200} className={s.subHeading}>
			Read core {productName} documentation and tutorials, including self-hosted
			open source docs.
		</Text>
	)
}

function getLinkText(productName: ProductName, product: HcpProductSlug) {
	if (productName === HCP_VAULT_SECRETS) {
		return (
			<StandaloneLink
				text={`Get Started for Free`}
				href={`https://portal.cloud.hashicorp.com`}
				icon={<IconExternalLink16 className={s.ctaIcon} />}
				iconPosition="trailing"
				className={s.ctaWrapper}
				color="secondary"
				opensInNewTab
			/>
		)
	}
	return (
		<StandaloneLink
			text={`Go to ${productName}`}
			href={`/${product}/docs`}
			icon={<IconArrowRight16 className={s.ctaIcon} />}
			iconPosition="trailing"
			className={s.ctaWrapper}
			color="secondary"
		/>
	)
}
