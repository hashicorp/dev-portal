import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import useAuthentication from 'hooks/use-authentication'
import { TutorialData } from 'views/tutorial-view'
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import Button from 'components/button'
import { Badges, getIsBeta } from './components'
import InteractiveLabButton from './components/interactive-lab-button'
import s from './tutorial-meta.module.css'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
}

export default function TutorialMeta({ heading, meta }: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta

	/**
	 * We only need to show the Create Account CTA if auth is enabled and there is
	 * not already a user authenticated.
	 */
	const { isAuthenticated, isAuthEnabled, isLoading } = useAuthentication()
	const showCreateAccountCta = isAuthEnabled && !isLoading && !isAuthenticated
	/**
	 * TODO - This state will likely be passed down from the tutorial level.
	 * hook up to real data
	 */
	const isBookmarked = false

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
				<span className={s.buttonGroup}>
					<InteractiveLabButton />
					{isAuthEnabled ? (
						<Button
							color="secondary"
							text={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
							icon={
								isBookmarked ? <IconBookmarkRemove16 /> : <IconBookmarkAdd16 />
							}
							onClick={() => console.log('Bookmark button clicked!')} // TODO hook up to real state mgmt, show dialog etc.
						/>
					) : null}
				</span>
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
