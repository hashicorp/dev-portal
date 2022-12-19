import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'

type DocsVersionSwitcherOption = VersionSelectItem

interface DocsVersionSwitcherProps {
	options?: DocsVersionSwitcherOption[]
	projectName?: string
}

export type { DocsVersionSwitcherOption, DocsVersionSwitcherProps }
