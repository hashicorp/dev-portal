import { IconBookmarkRemove16 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-16'
import { IconBookmarkAdd16 } from '@hashicorp/flight-icons/svg-react/bookmark-add-16'
import { ApiBookmark } from 'lib/learn-client/api/api-types'
import useAuthentication from 'hooks/use-authentication'
import {
	useBookmarks,
	useIsBookmarked,
	useMutateBookmark,
} from 'hooks/bookmarks'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import Heading from 'components/heading'
import Text from 'components/text'
import { useTutorial, useTutorials } from 'hooks/tutorials'
import TutorialCard from 'components/tutorial-card'
import CardsGridList from 'components/cards-grid-list'

const TutorialCardWrapper = ({ tutorialId }) => {
	const { addBookmark, removeBookmark } = useMutateBookmark()
	const { tutorial, isFetching: tutorialIsFetching } = useTutorial(tutorialId)
	const { isBookmarked, isFetching: bookmarkIsFetching } = useIsBookmarked(
		tutorial?.id,
		{ enabled: !tutorialIsFetching }
	)

	const isLoading = tutorialIsFetching || bookmarkIsFetching
	if (isLoading) {
		return null
	}

	const productsUsed = tutorial.productsUsed.map(
		({ product: { slug } }) => slug
	)
	const duration = `${tutorial.readTime}min`
	const hasInteractiveLab = !!tutorial.handsOnLab
	const hasVideo = !!tutorial.video
	const heading = tutorial.name
	const url = '/'

	return (
		<div style={{ position: 'relative' }}>
			<TutorialCard
				description={tutorial.description}
				duration={duration}
				hasInteractiveLab={hasInteractiveLab}
				hasVideo={hasVideo}
				heading={heading}
				productsUsed={productsUsed}
				url={url}
			/>
			<button
				onClick={() => {
					if (isBookmarked) {
						removeBookmark(tutorial.id)
					} else {
						addBookmark(tutorial.id)
					}
				}}
				style={{ position: 'absolute', top: 16, right: 16 }}
			>
				{isBookmarked ? <IconBookmarkRemove16 /> : <IconBookmarkAdd16 />}
			</button>
		</div>
	)
}

const BookmarksList = () => {
	const { bookmarks, isError, isLoading } = useBookmarks()

	if (isLoading) {
		return <p>Loading bookmarks...</p>
	}

	if (isError) {
		return <p>There was an error loading bookmarks.</p>
	}

	if (bookmarks.length > 0) {
		return (
			<ul>
				{bookmarks.map((bookmark: ApiBookmark) => (
					<Text asElement="li" key={bookmark.id}>
						{bookmark.tutorial.name}
					</Text>
				))}
			</ul>
		)
	}

	return <p>There are no bookmarks.</p>
}

const BookmarksPage = () => {
	const { isLoading, showAuthenticatedUI, showUnauthenticatedUI } =
		useAuthentication()
	const { tutorials } = useTutorials({ fullContent: false, limit: 5 })

	return (
		<SidebarSidecarLayout
			AlternateSidebar={() => null}
			sidebarNavDataLevels={[]}
			sidecarSlot={null}
			breadcrumbLinks={[
				{ title: 'Developer', url: '/' },
				{ title: 'Bookmarks', url: '/profile/bookmarks', isCurrentPage: true },
			]}
		>
			<section>
				<Heading level={2} size={400} weight="bold">
					Bookmarked Tutorials
				</Heading>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<>
						{showAuthenticatedUI ? <BookmarksList /> : null}
						{showUnauthenticatedUI ? <p>Please log in.</p> : null}
					</>
				)}
			</section>
			<section>
				<Heading level={2} size={400} weight="bold">
					Other Tutorials
				</Heading>
				<br />
				{tutorials && tutorials.length && (
					<CardsGridList>
						{tutorials.map((tutorial) => (
							<li key={tutorial.id}>
								<TutorialCardWrapper tutorialId={tutorial.id} />
							</li>
						))}
					</CardsGridList>
				)}
			</section>
		</SidebarSidecarLayout>
	)
}

export default BookmarksPage
