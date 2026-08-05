/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
// Components
import { Hero } from 'components/landing-hero/components/hero'
import Heading from '@components/heading'
import Text from '@components/text'
import ButtonLink from '@components/button-link'
import { Text as MDSText } from '@hashicorp/mds-react/components'
// Types
import { CertificationHeroProps } from './types'
// Styles
import s from './certification-hero.module.css'
// Icon
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'

/**
 * Render a styled hero for an individual program page.
 */
function CertificationHero({
	eyebrow,
	heading,
	description,
	leftCta,
	rightCta,
}: CertificationHeroProps) {
	return (
		<Hero
			backgroundClassName={classNames(s.heroBackground)}
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
							{heading}
						</Heading>
						<Text className={s.heroDescriptionText}>{description}</Text>
						<div className={s.ctaGroup}>
							{leftCta && (
								<ButtonLink text={leftCta.text} href={leftCta.link} size="small" className={s.buttonLink} />
							)}
							{rightCta && (
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
		/>
	)
}

export { CertificationHero }
