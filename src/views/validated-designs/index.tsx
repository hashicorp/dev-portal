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
import { MobileView, BrowserView, isMobile } from 'react-device-detect'
import s from './style.module.css'

import Heading from 'components/heading'
import Text from 'components/text'
import IconTileLogo from 'components/icon-tile-logo'

const LinkTextAndIcon = () => {
	return (
		<>
			<MobileView>
				<StandaloneLinkContents
					className={s.standaloneLinkContents}
					icon={<IconArrowRight24 />}
					iconPosition="trailing"
					inheritColor
					size="medium"
					text=""
				/>
			</MobileView>
			<BrowserView>
				<StandaloneLinkContents
					className={s.standaloneLinkContents}
					icon={<IconArrowRight16 />}
					iconPosition="trailing"
					inheritColor
					size="medium"
					text="View"
				/>
			</BrowserView>
		</>
	)
}

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
							<Heading level={2} size={isMobile ? 400 : 500} weight="bold">
								{category.title}
							</Heading>
						</section>
						<Text
							asElement="p"
							size={isMobile ? 200 : 300}
							weight="medium"
							className={s.categoryGroupDescription}
						>
							{category.description}
						</Text>
						<div className={s.categoryGuidesContainer}>
							{category.guides.map((guide: HvdGuide) => (
								<CardLink
									key={guide.slug}
									href={guide.href}
									ariaLabel={guide.title}
									className={s.guideCard}
								>
									<Heading level={3} size={isMobile ? 200 : 300} weight="bold">
										{guide.title}
									</Heading>
									<LinkTextAndIcon />
								</CardLink>
							))}
						</div>
					</Card>
				))}
			</div>
		</BaseLayout>
	)
}
