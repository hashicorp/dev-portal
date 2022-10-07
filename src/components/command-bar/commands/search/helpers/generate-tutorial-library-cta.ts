import { CommandBarTag } from 'components/command-bar'

const generateTutorialLibraryCta = (currentProductTag: CommandBarTag) => {
	let href: string
	let text: string

	if (currentProductTag) {
		href = `/tutorials/library?${
			currentProductTag.id === 'hcp'
				? 'edition=hcp'
				: `product=${currentProductTag.id}`
		}`
		text = `See all ${currentProductTag.text} tutorials in the Tutorial Library`
	} else {
		href = '/tutorials/library'
		text = 'See all tutorials in the Tutorial Library'
	}

	return { href, text }
}

export { generateTutorialLibraryCta }
