import { OutlineLinkItem } from '../types'

/**
 * Add `dataHeapTrack` attributes to OutlineItems.
 *
 * The attributes are in the format `toc-list-item-index-<number>`,
 * where the `<number>` is an index that runs continuously through
 * all nested outline items, depth-first.
 *
 * Note: this "inner" version of the function does the actual work,
 * we need to keep track of the `nextIndex` as we recurse, but we
 * want the "outer" version of the function to cleanly return `items` only.
 */
function addHeapAttributesInner(
	items: OutlineLinkItem[],
	nextIndex: number = 0
): { items: OutlineLinkItem[]; nextIndex: number } {
	return items.reduce(
		(
			acc: { items: OutlineLinkItem[]; nextIndex: number },
			item: OutlineLinkItem
		) => {
			// The heap-track attribute will be the same for this item, nested or not
			const heapTrack = `toc-list-item-index-${acc.nextIndex}`
			if ('items' in item) {
				/**
				 * If this item has nested items, we recurse, and this affects the
				 * next index number we'll include in subsequent items.
				 */
				const clonedItem = { ...item, heapTrack }
				const recurseResult = addHeapAttributesInner(
					item.items,
					acc.nextIndex + 1
				)
				clonedItem.items = recurseResult.items
				acc.nextIndex = recurseResult.nextIndex
				acc.items.push(clonedItem)
			} else {
				// If this item does not have nested items, we increment nextIndex.
				const clonedItem = { ...item, heapTrack }
				acc.nextIndex += 1
				acc.items.push(clonedItem)
			}
			return acc
		},
		{ items: [], nextIndex }
	)
}

/**
 * Add `dataHeapTrack` attributes to OutlineItems.
 *
 * The attributes are in the format `toc-list-item-index-<number>`,
 * where the `<number>` is an index that runs continuously through
 * all nested outline items, depth-first.
 */
function addHeapAttributes(items: OutlineLinkItem[]): OutlineLinkItem[] {
	return addHeapAttributesInner(items, 0).items
}

export { addHeapAttributes }
