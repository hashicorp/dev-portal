/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import useAuthentication from 'hooks/use-authentication'
import { TutorialData } from 'views/tutorial-view'
import { TutorialVariant } from 'views/tutorial-view/utils/variants'
import { MobileVariantDropdownDisclosure } from 'views/tutorial-view/components/variant-dropdown-disclosure/mobile'
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import { TutorialMetaBookmarkButton } from 'components/bookmark-button'
import { Badges, getIsBeta, VariantList } from './components'
import InteractiveLabButton from './components/interactive-lab-button'
import s from './tutorial-meta.module.css'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
	tutorialId: TutorialData['id']
	variant?: TutorialVariant
}

export default function TutorialMeta({
	heading,
	meta,
	tutorialId,
	variant,
}: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta

	/**
	 * We only need to show the Create Account CTA if auth is enabled and there is
	 * not already a user authenticated.
	 */
	const { isAuthenticated, isLoading } = useAuthentication()
	const showCreateAccountCta = !isLoading && !isAuthenticated

	return (
		<header className={s.header}>
			<Heading
				level={1}
				size={600}
				weight="bold"
				id={heading.slug}
				className={s.heading}
			>
				{heading.text}
			</Heading>
			<div className={s.meta}>
				<Badges
					options={{
						readTime,
						isBeta: getIsBeta(productsUsed),
						products: productsUsed.map((p) => ({
							name: p.product.name,
							slug: p.product.slug,
						})),
						edition,
						hasVideo,
						isInteractive,
					}}
				/>
				<span className={s.buttonGroup}>
					<InteractiveLabButton />
					<TutorialMetaBookmarkButton
						tutorial={{ id: tutorialId, name: heading.text }}
					/>
				</span>
			</div>
			{showCreateAccountCta ? (
				<Text className={s.createAccountCta} size={100}>
					Reference this often?{' '}
					<InlineLink href="/sign-up" textSize={100}>
						Create an account
					</InlineLink>{' '}
					to bookmark tutorials.
				</Text>
			) : null}
			{variant ? <VariantList variant={variant} /> : null}
		</header>
	)
}
