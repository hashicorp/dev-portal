import classNames from 'classnames'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { ProductWithCurrentRootDocsPath } from 'types/products'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import NavigationDisclosure, {
  NavigationDisclosureActivator,
  NavigationDisclosureContent,
  NavigationDisclosureLink,
  NavigationDisclosureList,
  NavigationDisclosureListItem,
} from 'components/navigation-disclosure'
import Text from 'components/text'
import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'
import {
  getTargetPath,
  getVersionFromPath,
  removeVersionFromPath,
} from './helpers'
import s from './docs-version-switcher.module.css'

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

  // TODO - do this "inline" so we're not iterating once for data and second for render
  const navigationDisclosureLinks = options.map(
    (option: DocsVersionSwitcherOption) => {
      let href: string
      if (option.isLatest) {
        href = removeVersionFromPath(currentPath)
      } else {
        href = getTargetPath({
          basePath: `${currentProduct.slug}/${currentProduct.currentRootDocsPath.path}`,
          asPath: currentPath,
          version: option.version,
        })
      }

      return {
        text: option.label,
        href,
      }
    }
  )

  // TODO style the pieces
  return (
    <nav>
      <NavigationDisclosure
        className={(isOpen: boolean) => {
          return classNames(s.root, {
            [s['root-expanded']]: isOpen,
          })
        }}
      >
        {/* TODO add aria label */}
        <NavigationDisclosureActivator className={s.activator}>
          <span className={s.activatorTextWrapper}>
            <Text
              asElement="span"
              className={s.activatorText}
              size={200}
              weight="regular"
            >
              {selectedOption.label}
            </Text>
            <span className={s.activatorIcon}>
              <IconCaret16 />
            </span>
          </span>
        </NavigationDisclosureActivator>
        <NavigationDisclosureContent>
          <NavigationDisclosureList className={s.optionList}>
            {navigationDisclosureLinks.map(({ href, text }) => {
              return (
                <NavigationDisclosureListItem key={href}>
                  {/* TODO calculate isActive when the link array is built */}
                  <NavigationDisclosureLink
                    className={s.optionLink}
                    href={href}
                    isActive={false}
                  >
                    {text}
                  </NavigationDisclosureLink>
                </NavigationDisclosureListItem>
              )
            })}
          </NavigationDisclosureList>
        </NavigationDisclosureContent>
      </NavigationDisclosure>
    </nav>
  )
}

export type { DocsVersionSwitcherProps }
export default DocsVersionSwitcher
