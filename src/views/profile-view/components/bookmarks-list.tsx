enum Product {
	Vault = "vault",
	Terraform = "terraform",
}

interface Bookmark {
	id: string
	name: string
	url: string
	read_time: int
	products: Array<Product>
}

interface BookmarksListProps {
	bookmarks: Array<Bookmark>
}

export default function BookmarksList({ bookmarks }) {
	return (
		<h1>
			Bookmarks List
		</h1>
	)
}
