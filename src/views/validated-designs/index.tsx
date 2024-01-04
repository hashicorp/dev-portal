/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import { HvdCategoryGroup, HvdGuide } from './types'
import LandingHero from 'components/landing-hero'
import Card from 'components/card'
import CardLink from 'components/card-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { StandaloneLinkContents } from 'components/standalone-link'
import s from './style.module.css'

import Heading from 'components/heading'
import Text from 'components/text'
import IconTileLogo from 'components/icon-tile-logo'

/**
 * Stub interfaces for how we may model the data for this view
 * Can be updated and adjusted as anyone sees fit based on the needs of the view
 */
export interface ValidatedDesignsLandingProps {
	categoryGroups: HvdCategoryGroup[]
}

export default function ValidatedDesignsLandingView({
	categoryGroups,
}: ValidatedDesignsLandingProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />} className={s.root}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
				<title>HashiCorp Validated Design</title>
				<meta name="description" content="HashiCorp Validated Design" />
			</Head>
			<LandingHero
				heading="HashiCorp Validated Design"
				isHvd={true}
				className={s.hvdHero}
			/>
			<div className={s.categoryGroupsContainer}>
				{categoryGroups.map((category: HvdCategoryGroup) => (
					<Card
						elevation="base"
						key={category.slug}
						className={s.categoryGroupContainer}
					>
						<section className={s.categoryGroupHeader}>
							<IconTileLogo size="large" productSlug={category.product} />
							<Heading
								level={2}
								size={400}
								weight="bold"
								className={s.categoryGroupHeading}
							>
								{category.title}
							</Heading>
						</section>
						<Text
							asElement="p"
							weight="medium"
							size={200}
							className={s.categoryGroupDescription}
						>
							{category.description}
						</Text>
						<ul className={s.categoryGuidesContainer}>
							{category.guides.map((guide: HvdGuide) => (
								<li key={guide.slug}>
									<CardLink
										href={guide.href}
										ariaLabel={guide.title}
										className={s.guideCard}
									>
										<Heading
											level={3}
											size={200}
											weight="semibold"
											className={s.smallHeading}
										>
											{guide.title}
										</Heading>
										<StandaloneLinkContents
											className={s.standaloneLinkContents}
											icon={
												<>
													<IconArrowRight24 className={s.mobileOnly} />
													<IconArrowRight16 className={s.tabletUp} />
												</>
											}
											iconPosition="trailing"
											inheritColor
											size="medium"
											text="View"
											textClassName={s.tabletUp}
										/>
									</CardLink>
								</li>
							))}
						</ul>
					</Card>
				))}
			</div>
		</BaseLayout>
	)
}
