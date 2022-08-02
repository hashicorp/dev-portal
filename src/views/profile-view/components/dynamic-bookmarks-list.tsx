import { useState, useEffect } from 'react'
import useAuthentication from 'hooks/use-authentication'
import Heading from 'components/heading'
import BookmarksList from './bookmarks-list'

/**
 * Fetches user Bookmarks from the API & displays them in a BookmarksList
 */
export default function DynamicBookmarksList() {
	// Fetch Bookmarks
	const { session } = useAuthentication()
	const [bookmarks, setBookmarks] = useState(null)
	useEffect(() => {
		if (session?.access_token) {
			fetch(`${process.env.NEXT_PUBLIC_LEARN_API_BASE_URL}/bookmarks`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					setBookmarks(res.result)
				})
		}
	}, [])

	// Render
	return bookmarks ? (
		<>
			<Heading level={1} size={500} weight="bold">
				Bookmarks
			</Heading>
			<BookmarksList bookmarks={bookmarks} />
		</>
	) : (
		<Heading level={1} size={500} weight="bold">
			Loading Bookmarks...
		</Heading>
	)
}
