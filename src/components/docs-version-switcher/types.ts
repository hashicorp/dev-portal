import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'

type DocsVersionSwitcherOption = VersionSelectItem

interface DocsVersionSwitcherProps {
  options?: DocsVersionSwitcherOption[]
}

export type { DocsVersionSwitcherOption, DocsVersionSwitcherProps }
