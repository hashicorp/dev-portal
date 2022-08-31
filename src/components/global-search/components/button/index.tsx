import { useEffect } from 'react'
import { IconSearch16 } from '@hashicorp/flight-icons/svg-react/search-16'
import { useGlobalSearch } from 'contexts'
import Text from 'components/text'
import s from './global-search-button.module.css'

/**
 * Using a variable for good measure so the aria-label and visual label match.
 * This is necessary for voice control users.
 */
const VISUAL_LABEL = 'Search'

const GlobalSearchButton = () => {
	const { isGlobalSearchEnabled, toggleSearchIsOpen } = useGlobalSearch()

	useEffect(() => {
		if (!isGlobalSearchEnabled) {
			return
		}

		const handleKeyDown = (e) => {
			const { ctrlKey, metaKey, key } = e
			if (key === 'k' && (ctrlKey || metaKey)) {
				toggleSearchIsOpen()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isGlobalSearchEnabled, toggleSearchIsOpen])

	if (!isGlobalSearchEnabled) {
		return null
	}

	return (
		<button
			aria-label={VISUAL_LABEL}
			className={s.root}
			onClick={() => toggleSearchIsOpen()}
		>
			<IconSearch16 className={s.searchIcon} />
			<Text
				asElement="span"
				className={s.searchText}
				size={200}
				weight="regular"
			>
				{VISUAL_LABEL}
			</Text>
		</button>
	)
}

export default GlobalSearchButton
