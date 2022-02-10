import { ReactElement } from 'react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowRight24 } from '@hashicorp/flight-icons/svg-react/arrow-right-24'
import { IconPlus16 } from '@hashicorp/flight-icons/svg-react/plus-16'
import { IconPlus24 } from '@hashicorp/flight-icons/svg-react/plus-24'
import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'
import { IconGithub24 } from '@hashicorp/flight-icons/svg-react/github-24'

const ICON_MAP = {
  'arrow-right': {
    16: <IconArrowRight16 />,
    24: <IconArrowRight24 />,
  },
  github: {
    16: <IconGithub16 />,
    24: <IconGithub24 />,
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
