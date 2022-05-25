import { ProductWithCurrentRootDocsPath } from 'types/products'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import NavigationDisclosure from 'components/navigation-disclosure'
import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'
import {
  getTargetPath,
  getVersionFromPath,
  removeVersionFromPath,
} from './helpers'

const DocsVersionSwitcher = ({ options }: DocsVersionSwitcherProps) => {
  const currentProduct = useCurrentProduct() as ProductWithCurrentRootDocsPath
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

  if (!options || options.length === 0) {
    return null
  }

  const selectedVersion = getVersionFromPath(currentPath)
  let selectedOption
  if (selectedVersion) {
    selectedOption = options.find(
      (option: DocsVersionSwitcherOption) => option.version === selectedVersion
    )
  } else {
    selectedOption = options[0]
  }

  const navigationDisclosureLinks = options.map(
    (option: DocsVersionSwitcherOption) => {
      let url: string
      if (option.isLatest) {
        url = removeVersionFromPath(currentPath)
      } else {
        url = getTargetPath({
          basePath: `${currentProduct.slug}/${currentProduct.currentRootDocsPath.path}`,
          asPath: currentPath,
          version: option.version,
        })
      }

      return {
        text: option.label,
        url,
      }
    }
  )

  return (
    <nav>
      <NavigationDisclosure links={navigationDisclosureLinks}>
        {selectedOption.label}
      </NavigationDisclosure>
    </nav>
  )
}

export type { DocsVersionSwitcherProps }
export default DocsVersionSwitcher
