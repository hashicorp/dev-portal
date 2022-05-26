import { ProductWithCurrentRootDocsPath } from 'types/products'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
// import NavigationDisclosure from 'components/navigation-disclosure'
import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'
import {
  getTargetPath,
  getVersionFromPath,
  removeVersionFromPath,
} from './helpers'

/**
 * !TODO - VERY WIP & COPY-PASTA'd from another branch
 */

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
      {/* <NavigationDisclosure links={navigationDisclosureLinks}>
        {selectedOption.label}
      </NavigationDisclosure> */}
    </nav>
  )
}

export type { DocsVersionSwitcherProps }
export default DocsVersionSwitcher

// import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
// import { ProductWithCurrentRootDocsPath } from 'types/products'
// import { useCurrentProduct } from 'contexts'
// import useCurrentPath from 'hooks/use-current-path'
// import NavigationDisclosure from 'components/navigation-disclosure'
// import Text from 'components/text'
// import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'
// import {
//   getTargetPath,
//   getVersionFromPath,
//   removeVersionFromPath,
// } from './helpers'
// import s from './docs-version-switcher.module.css'

// const DocsVersionSwitcher = ({ options }: DocsVersionSwitcherProps) => {
//   const currentProduct = useCurrentProduct() as ProductWithCurrentRootDocsPath
// 	@@ -48,9 +51,22 @@ const DocsVersionSwitcher = ({ options }: DocsVersionSwitcherProps) => {
//   )

//   return (
//     <nav className={s.root}>
//       <NavigationDisclosure
//         activatorClassName={s.button}
//         links={navigationDisclosureLinks}
//       >
//         <Text
//           asElement="span"
//           className={s.buttonText}
//           size={200}
//           weight="regular"
//         >
//           {selectedOption.label}
//         </Text>
//         <span className={s.buttonIcon}>
//           <IconCaret16 />
//         </span>
//       </NavigationDisclosure>
//     </nav>
//   )
