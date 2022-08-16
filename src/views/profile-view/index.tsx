import { useAllBookmarks, useBookmarkMutations } from 'hooks/bookmarks'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import Heading from 'components/heading'

const ProfileView = () => {
	return (
		<AuthenticatedView>
			<ProfileViewContent />
		</AuthenticatedView>
	)
}

/**
 * The content of the ProfileView that is gated behind authentication.
 */
const ProfileViewContent = () => {
	const { bookmarks, isLoading } = useAllBookmarks()
	const { removeBookmark } = useBookmarkMutations()

	if (isLoading) {
		return <p>loading...</p>
	}

	return (
		<>
			<Heading level={1} size={500} weight="bold">
				Bookmarks
			</Heading>
			<ul>
				{bookmarks?.map((bookmark) => {
					return (
						<li key={bookmark.id}>
							{bookmark.tutorial.name}
							<button onClick={() => removeBookmark(bookmark.tutorial_id)}>
								remove
							</button>
						</li>
					)
				})}
			</ul>
		</>
	)
}

ProfileView.layout = BaseNewLayout
export default ProfileView
