import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import { useBookmarkMutations, useIsBookmarked } from 'hooks/bookmarks'
import { Tutorial } from 'lib/learn-client/types'
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
	tutorialId: Tutorial['id']
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
	const { isBookmarked } = useIsBookmarked({ tutorialId })
	const { addBookmark, removeBookmark } = useBookmarkMutations()

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
							onClick={() => {
								if (isBookmarked) {
									removeBookmark(tutorialId)
								} else {
									addBookmark(tutorialId)
								}
							}}
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
