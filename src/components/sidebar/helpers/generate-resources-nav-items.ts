import { ProductSlug } from 'types/products'
import { developmentToast, ToastColor } from 'components/toast'

const DEFAULT_ITEMS = [
	{
		title: 'All Tutorials',
		href: 'https://learn.hashicorp.com/',
	},
	{
		title: 'Community Forum',
		href: 'https://discuss.hashicorp.com/',
	},
	{
		title: 'Support',
		href: 'https://www.hashicorp.com/customer-success',
	},
	{
		title: 'GitHub',
		href: 'https://github.com/hashicorp',
	},
]

/**
 * Generates the sidebar nav items for the Resources section of the sidebar.
 * Optionally accepts a Product slug for customization of links. Invokes
 * additional helper functions for each nav item as needed.
 */
const generateResourcesNavItems = (productSlug?: ProductSlug) => {
	let resourceItems = DEFAULT_ITEMS
	if (productSlug) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const data = require(`content/${productSlug}/sidebar-resources.json`)
			resourceItems = data.items
		} catch {
			developmentToast({
				color: ToastColor.critical,
				title: 'Error in `generateResourcesNavItems`',
				description: `Could not load "sidebar-resources.json" content file for "${productSlug}". Rendering default Resources items instead.`,
			})
		}
	}

	return [{ heading: 'Resources' }, ...resourceItems]
}

export { generateResourcesNavItems }
