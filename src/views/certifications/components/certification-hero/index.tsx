/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Hooks
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

// Components
import { Hero } from 'components/landing-hero/components/hero'
import Heading from '@components/heading'
import Text from '@components/text'
import Image from 'next/image'
import ButtonLink from '@components/button-link'
import { Text as MDSText } from '@hashicorp/mds-react/components'

// Types
import { CertificationHeroProps } from './types'

// Styles
import classNames from 'classnames'
import s from './certification-hero.module.css'

// Icon
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'

// Images
import homepageDark from './assets/images/homepage-dark.svg'
import homepageLight from './assets/images/homepage-light.svg'
import terraformAssociateDark from './assets/images/terraform-associate-dark.svg'
import terraformAssociateLight from './assets/images/terraform-associate-light.svg'
import terraformProfessionalDark from './assets/images/terraform-professional-dark.svg'
import terraformProfessionalLight from './assets/images/terraform-professional-light.svg'
import vaultAssociateDark from './assets/images/vault-associate-dark.svg'
import vaultAssociateLight from './assets/images/vault-associate-light.svg'
import vaultProfessionalDark from './assets/images/vault-professional-dark.svg'
import vaultProfessionalLight from './assets/images/vault-professional-light.svg'

// Add a product prop to the CertsHero + update schemas for the corresponding views
// Potential products = ["terraform-associate", "terraform-professional", "vault-associate", "vault-professional"]
// Create a mapping from "product" -> SVG (e.g. "terraform-associate" -> imported image)
// For the background gradient, we can create classes of background-gradient[-terraform/vault]
// Split the product by "-" and take the first entry (e.g. terraform-associate -> ['terraform', 'associate'])
// Add those to the CSS file + add to the classNames down in line 39
const HERO_SVG_MAP = {
	'homepage-light': homepageLight,
	'homepage-dark': homepageDark,
	'terraform-associate-light': terraformAssociateLight,
	'terraform-associate-dark': terraformAssociateDark,
	'terraform-professional-light': terraformProfessionalLight,
	'terraform-professional-dark': terraformProfessionalDark,
	'vault-associate-light': vaultAssociateLight,
	'vault-associate-dark': vaultAssociateDark,
	'vault-professional-light': vaultProfessionalLight,
	'vault-professional-dark': vaultProfessionalDark,
}

/**
 * Render a styled hero for an individual program page.
 */

// Maybe instead of passing in a product prop in multiple sections
// we could parse and format the title into info that we can use
// Other things to note: SVGs are not equal height, so they jump
// Light mode SVGs look wonky because the bars don't show up...
function CertificationHero({
	product,
	eyebrow,
	title,
	description,
	leftCta,
	rightCta,
}: CertificationHeroProps) {
	const [mounted, setMounted] = useState(false)
	const { theme } = useTheme()

	/*
		Safeguard to ensure SSR rendering of theme isn't undefined
		Next.js renders components from the server first before hydrating (adding event listeners & rerunning effects)
		This means the theme will be undefined since it exists only on the client on the first pass
		So we can opt to render nothing on the server through the mounted state
		Then, when we get to the client, we can run the useEffect to enable rendering now that theme is populated
	*/
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	// Homepage does not have it's own product, so we manually assign product
	if (!product) {
		product = 'homepage'
	}
	const [productName, examType] = product.split('-')

	let SVG_MAP_QUERY: string = productName
	SVG_MAP_QUERY += examType ? `-${examType}` : ''
	SVG_MAP_QUERY += `-${theme}` // Need to add safeguard for when theme = "system"

	return (
		<Hero
			backgroundClassName={classNames(
				s.heroBackground,
				s[`hero-gradient-${productName}`],
			)}
			className={s.hero}
			startSlot={
				<>
					<div className={s.heroStartSlot}>
						{eyebrow && (
							<MDSText.Label className={s.eyebrowText} weight="semibold">
								{eyebrow}
							</MDSText.Label>
						)}
						<Heading
							level={1}
							size={600}
							weight="bold"
							className={s.heroHeadingText}
						>
							{title}
						</Heading>
						<Text className={s.heroDescriptionText}>{description}</Text>
						<div className={s.ctaGroup}>
							{leftCta && leftCta.text && leftCta.link && (
								<ButtonLink
									text={leftCta.text}
									href={leftCta.link}
									size="small"
									className={s.buttonLink}
								/>
							)}
							{rightCta && rightCta.text && rightCta.link && (
								<ButtonLink
									text={rightCta.text}
									href={rightCta.link}
									icon={<IconGuide16 />}
									iconPosition="trailing"
									color="tertiary"
									size="small"
									className={classNames(s.buttonLink, s.rightCta)}
								/>
							)}
						</div>
					</div>
				</>
			}
			endSlot={<Image src={HERO_SVG_MAP[SVG_MAP_QUERY]} alt="test" />}
		/>
	)
}

export { CertificationHero }
