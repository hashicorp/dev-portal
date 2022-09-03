import useAuthentication from 'hooks/use-authentication'
import { TutorialData } from 'views/tutorial-view'
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import { Badges, getIsBeta } from './components'
import InteractiveLabButton from './components/interactive-lab-button'
import s from './tutorial-meta.module.css'
import { TutorialMetaBookmarkButton } from 'components/bookmark-button'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
	tutorialId: TutorialData['id']
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
	const { isAuthenticated, isAuthEnabled, isLoading } = useAuthentication()
	const showCreateAccountCta = isAuthEnabled && !isLoading && !isAuthenticated

	return (
		<header className={s.header}>
			<Heading
				level={1}
				size={500}
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
				{/**
				 * TODO: remove this conditional once auth is released to prod,
				 * since the bookmark button will always render. If we don't
				 * conditionally render this and there is no interactive lab button,
				 * a margin stacking occurs that disrupts the layout
				 */}
				{isInteractive || isAuthEnabled ? (
					<span className={s.buttonGroup}>
						<InteractiveLabButton />
						{/*// NOTE! - hiding this component from prod until auth is enabled */}
						{isAuthEnabled ? (
							<TutorialMetaBookmarkButton
								tutorial={{ id: tutorialId, name: heading.text }}
							/>
						) : null}
					</span>
				) : null}
				{showCreateAccountCta ? (
					<Text className={s.createAccountCta}>
						Reference this often?{' '}
						<InlineLink href="/sign-up">Create an account</InlineLink> to
						bookmark tutorials.
					</Text>
				) : null}
			</div>
		</header>
	)
}
