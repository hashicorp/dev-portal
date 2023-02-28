/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBookmark16 } from '@hashicorp/flight-icons/svg-react/bookmark-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { Badge } from 'components/badge-list'
import ContentHeaderCard, { Button } from 'components/content-header-card'
import InlineLink from 'components/inline-link'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import useAuthentication from 'hooks/use-authentication'
import { EditionOption } from 'lib/learn-client/types'
import { TutorialData } from 'views/tutorial-view'
import { getIsBeta } from './components'
import getReadableTime from './components/badges/helpers'
import s from './tutorial-meta.module.css'

interface TutorialMetaProps {
	heading: { slug: string; text: string; description?: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
	tutorialId: TutorialData['id']
}

const editionDisplayOptions: { [K in EditionOption]: string } = {
	[EditionOption.openSource]: 'Open Source',
	[EditionOption.enterprise]: 'Enterprise',
	[EditionOption.hcp]: 'HCP',
	[EditionOption.tfcStandard]: 'Standard',
	[EditionOption.tfcPlus]: 'Plus',
	/**
	 * Deprecated pricing tiers as of March '23
	 * To be removed after all content is updated
	 */
	[EditionOption.tfcFree]: 'Terraform Cloud',
	[EditionOption.tfcTeam]: 'Team',
	[EditionOption.tfcGov]: 'Team & Governance',
	[EditionOption.tfcBiz]: 'Business',
	/* --------------------------------------*/
}

export default function TutorialMeta({
	heading,
	meta,
	tutorialId,
}: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta

	/**
	 * We only need to show the Create Account CTA if auth is enabled and there is
	 * not already a user authenticated.
	 */
	const { isAuthenticated, isLoading } = useAuthentication()
	const showCreateAccountCta = !isLoading && !isAuthenticated

	/**
	 * Calculate Buttons here
	 */
	const buttons: Array<Button> = []

	// Instruqt
	const instruqtCtx = useInstruqtEmbed()
	if (instruqtCtx.labId) {
		const buttonText = `${instruqtCtx.active ? 'Hide' : 'Show'} Terminal`
		buttons.push({
			text: buttonText,
			icon: <IconTerminalScreen16 />,
			isPrimary: true,
			onClick: () => instruqtCtx.setActive(!instruqtCtx.active),
		})
	}

	// Bookmark
	buttons.push({
		text: 'Add Bookmark',
		icon: <IconBookmark16 />,
		onClick: () => console.log('TODO this is just a demo :)'),
	})

	/**
	 * Calculate the Badges here.
	 *
	 * We would likely abstract this out to a utility function, but doing it
	 * in line here for this POC.
	 */
	const badges: Array<Badge> = []
	if (getIsBeta(productsUsed)) {
		badges.push({
			text: 'Beta',
		})
	}
	const products = productsUsed.map((p) => ({
		name: p.product.name,
		slug: p.product.slug,
	}))
	const showProductBadges = Array.isArray(products) && products.length > 0
	if (showProductBadges) {
		products.forEach((product) => {
			badges.push({
				text: product.name,
				icon: <ProductIcon productSlug={product.slug} />,
			})
		})
	}

	if (isInteractive) {
		badges.push({
			text: 'Interactive',
			icon: <IconTerminalScreen16 />,
		})
	}

	if (hasVideo) {
		badges.push({
			text: 'Video',
			icon: <IconPlay16 />,
		})
	}

	// Edu team wants to hide the open source badge
	if (edition !== 'open_source') {
		badges.push({
			text: editionDisplayOptions[edition],
		})
	}
	// ---

	return (
		<header className={s.header}>
			<ContentHeaderCard
				description={heading.description}
				title={heading.text}
				note={getReadableTime(readTime)}
				badges={badges}
				buttons={buttons}
			/>

			<div className={s.meta}>
				{showCreateAccountCta ? (
					<Text className={s.createAccountCta} size={200}>
						Reference this often?{' '}
						<InlineLink href="/sign-up" textSize={200}>
							Create an account
						</InlineLink>{' '}
						to bookmark tutorials.
					</Text>
				) : null}
			</div>
		</header>
	)
}
