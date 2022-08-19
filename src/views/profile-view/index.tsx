import { useQuery } from '@tanstack/react-query'
import { getAllTutorials } from 'lib/learn-client/api/tutorial'
import {
	useBookmarkMutations,
	useBookmarksByTutorialIds,
	useIsBookmarked,
} from 'hooks/bookmarks'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import Card from 'components/card'

/**
 * The exported view component that handles wrapping the view content in
 * `AuthenticatedView`, which automatically handles rendering gated content.
 */
const ProfileView = () => {
	return (
		<AuthenticatedView>
			<ProfileViewContent />
		</AuthenticatedView>
	)
}

const TestTutorialCard = ({ id, name }) => {
	const { isBookmarked } = useIsBookmarked({
		tutorialId: id,
	})
	const { addBookmark, removeBookmark } = useBookmarkMutations()

	return (
		<Card>
			<div>{name}</div>
			<br />
			<button
				onClick={() => {
					if (isBookmarked) {
						removeBookmark(id)
					} else {
						addBookmark(id)
					}
				}}
			>
				{isBookmarked ? '- Remove bookmark' : '+ Add bookmark'}
			</button>
		</Card>
	)
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileViewContent = () => {
	const { data: tutorials, isLoading: tutorialsAreLoading } = useQuery(
		['tutorials'],
		() => getAllTutorials({ limit: 20 })
	)
	const { bookmarks, isLoading: bookmarksAreLoading } =
		useBookmarksByTutorialIds({
			enabled: !tutorialsAreLoading,
			tutorialIds: tutorials?.map((tutorial) => tutorial.id),
		})

	if (tutorialsAreLoading || bookmarksAreLoading) {
		return null
	}

	return (
		<div style={{ padding: 24 }}>
			<h2>Bookmarks</h2>
			<ul>
				{bookmarks?.map((bookmark) => (
					<li key={bookmark.id}>{bookmark.tutorial.name}</li>
				))}
			</ul>
			<br />
			<h2>Tutorials</h2>
			<ul
				style={{
					display: 'grid',
					gridGap: 24,
					gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
					padding: 0,
				}}
			>
				{tutorials?.map((tutorial) => (
					<TestTutorialCard
						key={tutorial.id}
						id={tutorial.id}
						name={tutorial.name}
					/>
				))}
			</ul>
		</div>
	)
}

ProfileView.layout = BaseNewLayout
export default ProfileView
