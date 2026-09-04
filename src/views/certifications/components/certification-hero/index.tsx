/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

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
import homepageDark from './assets/images/homepage-dark.png'
import homepageLight from './assets/images/homepage-light.png'
import terraformAssociateLight from './assets/images/terraform-associate-light.png'
import terraformAssociateDark from './assets/images/terraform-associate-dark.png'
import terraformProfessionalLight from './assets/images/terraform-professional-light.png'
import terraformProfessionalDark from './assets/images/terraform-professional-dark.png'
import vaultAssociateLight from './assets/images/vault-associate-light.png'
import vaultAssociateDark from './assets/images/vault-associate-dark.png'
import vaultProfessionalLight from './assets/images/vault-professional-light.png'
import vaultProfessionalDark from './assets/images/vault-professional-dark.png'

// Bar Gradients
import homepageBarGradientLight from './assets/gradients/homepage-bar-gradient-light.svg'
import homepageBarGradientDark from './assets/gradients/homepage-bar-gradient-dark.svg'
import vaultBarGradientAssociateLight from './assets/gradients/vault-bar-gradient-associate-light.svg'
import vaultBarGradientAssociateDark from './assets/gradients/vault-bar-gradient-associate-dark.svg'
import vaultBarGradientProfessionalLight from './assets/gradients/vault-bar-gradient-professional-light.svg'
import vaultBarGradientProfessionalDark from './assets/gradients/vault-bar-gradient-professional-dark.svg'
import terraformBarGradientAssociateLight from './assets/gradients/terraform-bar-gradient-associate-light.svg'
import terraformBarGradientAssociateDark from './assets/gradients/terraform-bar-gradient-associate-dark.svg'
import terraformBarGradientProfessionalLight from './assets/gradients/terraform-bar-gradient-professional-light.svg'
import terraformBarGradientProfessionalDark from './assets/gradients/terraform-bar-gradient-professional-dark.svg'

const HERO_PNG_MAP = {
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

const HERO_BAR_GRADIENT_MAP = {
	'homepage-light': homepageBarGradientLight,
	'homepage-dark': homepageBarGradientDark,
	'vault-associate-light': vaultBarGradientAssociateLight,
	'vault-associate-dark': vaultBarGradientAssociateDark,
	'vault-professional-light': vaultBarGradientProfessionalLight,
	'vault-professional-dark': vaultBarGradientProfessionalDark,
	'terraform-associate-light': terraformBarGradientAssociateLight,
	'terraform-associate-dark': terraformBarGradientAssociateDark,
	'terraform-professional-light': terraformBarGradientProfessionalLight,
	'terraform-professional-dark': terraformBarGradientProfessionalDark,
}

/**
 * Render a styled hero for an individual program page.
 */
function CertificationHero({
	product,
	eyebrow,
	title,
	description,
	leftCta,
	rightCta,
}: CertificationHeroProps) {
	// Homepage does not have it's own product, so we manually assign product
	if (!product) {
		product = 'homepage'
	}
	const [productName, examType] = product.split('-')

	let SVG_MAP_QUERY: string = productName
	SVG_MAP_QUERY += examType ? `-${examType}` : ''

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
			endSlot={
				<>
					<span
						data-hide-on-theme="dark"
						className={classNames(
							s.toggleImage,
							SVG_MAP_QUERY === 'homepage' && s.homepageMobileStyling,
						)}
					>
						<Image
							className={s.heroImage}
							src={HERO_PNG_MAP[`${SVG_MAP_QUERY}-light`]}
							alt="Certification Hero Badge/Person"
						/>
						<Image
							className={s.barGradient}
							src={HERO_BAR_GRADIENT_MAP[`${SVG_MAP_QUERY}-light`]}
							alt="Certification Hero Badge/Person"
						/>
					</span>
					<span
						data-hide-on-theme="light"
						className={classNames(
							s.toggleImage,
							SVG_MAP_QUERY === 'homepage' && s.homepageMobileStyling,
						)}
					>
						<Image
							className={s.heroImage}
							src={HERO_PNG_MAP[`${SVG_MAP_QUERY}-dark`]}
							alt="Certification Hero Badge/Person"
						/>
						<Image
							className={classNames(
								s.barGradient,
								SVG_MAP_QUERY === 'homepage' && s.homepageGradient,
							)}
							src={HERO_BAR_GRADIENT_MAP[`${SVG_MAP_QUERY}-dark`]}
							alt="Certification Hero Badge/Person"
						/>
					</span>
				</>
			}
		/>
	)
}

export { CertificationHero }
