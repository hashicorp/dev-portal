/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import Cookies from 'js-cookie'
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
import { useRouter } from 'next/router'
import { VariantOption } from 'views/tutorial-view/utils/variants'
import { TutorialVariant } from 'views/tutorial-view/types'
import { useVariants } from 'views/tutorial-view/utils/variants'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
	tutorialId: TutorialData['id']
	variant?: TutorialVariant
}

export function getVariantPath(path: string, variantType: string) {
	const url = new URL(path, 'https://developer.hashicorp.com')

	// if the variant is not defined, or if it is defined in the path already, use that
	if (!variantType || url.searchParams.get('variant') === variantType) {
		return path
	}

	// otherwise just add the variant to the path
	url.searchParams.set('variant', variantType)

	return url.pathname.toString() + url.search.toString()
}

export default function TutorialMeta({
	heading,
	meta,
	tutorialId,
	variant,
}: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta
	const router = useRouter()
	const { activeVariant } = useVariants()

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

					{variant ? (
						<>
							<label id="variant-options-label">{variant.id}</label>
							<nav>
								<ul aria-labelledby="variant-options-label">
									{variant.allOptions.map((option: VariantOption) => (
										<li
											key={option.id}
											aria-current={activeVariant === option.id}
										>
											<ButtonLink
												color={
													activeVariant === option.id ? 'primary' : 'secondary'
												}
												text={option.name}
												href={getVariantPath(router.asPath, option.id)} // make work with hashes & query etc
												onClick={() => {
													const variantCookie = Cookies.get(variant.id)
													// if it exists and its not already set with the same value
													if (!variantCookie || variantCookie !== option.id) {
														Cookies.set(variant.id, option.id)
													}
												}}
											/>
										</li>
									))}
								</ul>
							</nav>
						</>
					) : null}
				</span>
				{/* {variant ? (
					<fieldset>
						<legend>{variant.id}</legend>
						<div id="radioGroup">
							{variant?.allOptions.map((option: VariantOption) => (
								<>
									<input
										checked={option.id === activeVariant}
										type="radio"
										id={`${variant.id}:${option.id}`}
										name={variant.id}
										value={option.id}
										onChange={(e) => {
											const url = new URL(
												router.asPath,
												'https://developer.hashicorp.com'
											)
											url.searchParams.set('variant', option.id)
											const path = `${url.pathname.toString()}${url.search.toString()}`
											router.push(path, path, {
												shallow: true,
											})
											setActiveVariant(option.id)
											// TODO add cookie here
										}}
									/>
									<label htmlFor={`${variant.id}:${option.id}`}>
										{option.name}
									</label>
								</>
							))}
						</div>
					</fieldset>
				) : null} */}
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
