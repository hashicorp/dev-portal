// Icons
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconAppleColor16 } from '@hashicorp/flight-icons/svg-react/apple-color-16'
import { IconMicrosoftColor16 } from '@hashicorp/flight-icons/svg-react/microsoft-color-16'
/* Note: linux icon should be added to HDS Flight Icons soon */
import { IconLinuxColor16 } from 'views/product-downloads-view/boundary/components'
// Types
import { ReactElement } from 'react'
import { OperatingSystem } from 'lib/fetch-release-data'

/**
 * Map an operating system to its associated 16px color icon.
 */
export const operatingSystemIcons: Record<OperatingSystem, ReactElement> = {
	darwin: <IconAppleColor16 />,
	linux: <IconLinuxColor16 />,
	windows: <IconMicrosoftColor16 />,
	/**
	 * Note: remaining OS use generic download icon, for now,
	 * as they're not displayed in any current context,
	 * and sourcing these icons is outside the scope of current work.
	 */
	freebsd: <IconDownload16 />,
	openbsd: <IconDownload16 />,
	netbsd: <IconDownload16 />,
	archlinux: <IconDownload16 />,
}
