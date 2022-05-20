import { ReactElement } from 'react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { IconClipboardCopy16 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-16'
import { IconClipboardCopy24 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-24'
import { IconPlus16 } from '@hashicorp/flight-icons/svg-react/plus-16'
import { IconPlus24 } from '@hashicorp/flight-icons/svg-react/plus-24'
import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import { IconGithub24 } from '@hashicorp/flight-icons/svg-react/github-24'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { IconInfo24 } from '@hashicorp/flight-icons/svg-react/info-24'
import { IconCheck16 } from '@hashicorp/flight-icons/svg-react/check-16'
import { IconCheck24 } from '@hashicorp/flight-icons/svg-react/check-24'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconAlertOctagon16 } from '@hashicorp/flight-icons/svg-react/alert-octagon-16'
import { IconAlertOctagon24 } from '@hashicorp/flight-icons/svg-react/alert-octagon-24'
import { IconAlertTriangle16 } from '@hashicorp/flight-icons/svg-react/alert-triangle-16'
import { IconAlertTriangle24 } from '@hashicorp/flight-icons/svg-react/alert-triangle-24'
import { IconX16 } from '@hashicorp/flight-icons/svg-react/x-16'
import { IconX24 } from '@hashicorp/flight-icons/svg-react/x-24'

const ICON_MAP = {
  'arrow-right': {
    16: <IconArrowRight16 />,
    24: <IconArrowRight24 />,
  },
  'alert-octagon': {
    16: <IconAlertOctagon16 />,
    24: <IconAlertOctagon24 />,
  },
  'alert-triangle': {
    16: <IconAlertTriangle16 />,
    24: <IconAlertTriangle24 />,
  },
  check: {
    16: <IconCheck16 />,
    24: <IconCheck24 />,
  },
  'check-circle': {
    16: <IconCheckCircle16 />,
    24: <IconCheckCircle24 />,
  },
  copy: {
    16: <IconClipboardCopy16 />,
    24: <IconClipboardCopy24 />,
  },
  cross: {
    16: <IconX16 />,
    24: <IconX24 />,
  },
  github: {
    16: <IconGithub16 />,
    24: <IconGithub24 />,
  },
  info: {
    16: <IconInfo16 />,
    24: <IconInfo24 />,
  },
  plus: {
    16: <IconPlus16 />,
    24: <IconPlus24 />,
  },
}

interface SwingsetTestIconProps {
  name: 'arrow-right' | 'github' | 'plus'
  size: 16 | 24
}

/**
 * 🚨 SwingsetTestIcons should only be used in Swingset pages 🚨
 */
const SwingsetTestIcon = ({
  name = 'plus',
  size = 16,
}: SwingsetTestIconProps): ReactElement => {
  return ICON_MAP[name][size]
}

export default SwingsetTestIcon
