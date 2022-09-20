import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { ProductWithCurrentRootDocsPath } from 'types/products'
import { getTargetPath } from 'lib/get-target-path'
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import DropdownDisclosure, {
	DropdownDisclosureLabelItem,
	DropdownDisclosureLinkItem,
} from 'components/dropdown-disclosure'
import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'
import s from './docs-version-switcher.module.css'

const IS_DEV = process.env.NODE_ENV !== 'production'

const DocsVersionSwitcher = ({
	options,
	projectName,
}: DocsVersionSwitcherProps) => {
	const currentProduct = useCurrentProduct() as ProductWithCurrentRootDocsPath
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

	// Don't do anything if there aren't any options
	if (!options || options.length === 0) {
		if (IS_DEV) {
			console.warn('DocsVersionSwitcher has no `options` to render.')
		}
		return null
	}

	// Check if `currentRootDocsPath` is set
	const currentRootDocsPath = currentProduct.currentRootDocsPath
	if (!currentRootDocsPath) {
		if (IS_DEV) {
			console.error(
				`DocsVersionSwitcher requires 'currentRootDocsPath' to be set on 'currentProduct'. Make sure 'rootDocsPaths' is configured in 'src/data/${currentProduct.slug}.json'.`
			)
		}
		return null
	}

	// Get the selected option
	const selectedVersion = getVersionFromPath(currentPath)
	let selectedOption: DocsVersionSwitcherOption
	if (selectedVersion) {
		selectedOption = options.find(
			(option: DocsVersionSwitcherOption) => option.version === selectedVersion
		)
	} else {
		selectedOption = options[0]
	}

	// Build the `ariaLabel` that is announced when the activator is focused
	const currentRootDocsPathName =
		currentRootDocsPath.shortName || currentRootDocsPath.name
	const nameForLabel =
		projectName || `${currentProduct.name} ${currentRootDocsPathName}`
	const ariaLabel = `Choose a ${nameForLabel} version. Currently viewing ${selectedOption.label}.`
	return (
		<nav>
			<DropdownDisclosure
				aria-label={ariaLabel}
				className={s.docsVersionSwitcher}
				text={selectedOption.label}
				color="secondary"
				listPosition="right"
			>
				<DropdownDisclosureLabelItem>
					{projectName ?? currentProduct.name}
				</DropdownDisclosureLabelItem>
				{options
					// Hide currently selected version from dropdown list
					.filter(
						(option: VersionSelectItem) =>
							option.version !== selectedOption.version
					)
					.map((option: VersionSelectItem) => {
						let href: string
						let rel: string
						if (option.isLatest) {
							href = removeVersionFromPath(currentPath)
							rel = undefined
						} else {
							href = getTargetPath({
								basePath: `${currentProduct.slug}/${currentRootDocsPath.path}`,
								asPath: currentPath,
								version: option.version,
							})
							rel = 'nofollow'
						}
						return (
							<DropdownDisclosureLinkItem
								key={option.version}
								href={href}
								rel={rel}
							>
								{option.label}
							</DropdownDisclosureLinkItem>
						)
					})}
			</DropdownDisclosure>
		</nav>
	)
}

export type { DocsVersionSwitcherProps }
export default DocsVersionSwitcher
