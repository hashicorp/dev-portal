import { IconApi16 } from '@hashicorp/flight-icons/svg-react/api-16'
import { IconConnection16 } from '@hashicorp/flight-icons/svg-react/connection-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconEntryPoint16 } from '@hashicorp/flight-icons/svg-react/entry-point-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconPlug16 } from '@hashicorp/flight-icons/svg-react/plug-16'
import { IconTerminal16 } from '@hashicorp/flight-icons/svg-react/terminal-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'

/**
 * @TODO raise to a higher level in the project for reuse?
 */
export const SUPPORTED_ICONS = {
	'entry-point': <IconEntryPoint16 />,
	'terminal-screen': <IconTerminalScreen16 />,
	api: <IconApi16 />,
	connection: <IconConnection16 />,
	docs: <IconDocs16 />,
	download: <IconDownload16 />,
	guide: <IconGuide16 />,
	plug: <IconPlug16 />,
	terminal: <IconTerminal16 />,
}
