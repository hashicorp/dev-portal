/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import useAuthentication from 'hooks/use-authentication'
import { TutorialData } from 'views/tutorial-view'
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import ButtonLink from 'components/button-link'
import Text from 'components/text'
import { Badges, getIsBeta } from './components'
import InteractiveLabButton from './components/interactive-lab-button'
import s from './tutorial-meta.module.css'
import { TutorialMetaBookmarkButton } from 'components/bookmark-button'
import variantsData from 'content/variants.json'
import { NextRouter, useRouter } from 'next/router'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
	tutorialId: TutorialData['id']
}

function getVariantPath(router: NextRouter, variantType: string) {
	if (!variantType) {
		return router.asPath
	}

	const arr = router.asPath.split('/')

	if (router.query.tutorialSlug.length === 3) {
		const variantInPath = arr.slice().pop()

		if (variantInPath === variantType) {
			return router.asPath
		}
		arr[arr.length - 1] = variantType
	} else {
		// otherwise just add the variant to the path
		arr.push(variantType)
	}

	return arr.join('/')
}

export default function TutorialMeta({
	heading,
	meta,
	tutorialId,
}: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta
	const router = useRouter()

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
					{variantsData.consul.map((option) => (
						<ButtonLink
							key={option.id}
							text={option.name}
							href={getVariantPath(router, option.id)} // make work with hashes & query etc
						/>
					))}
				</span>
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
