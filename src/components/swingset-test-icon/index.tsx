import { ReactElement } from 'react'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconPlus16 } from '@hashicorp/flight-icons/svg-react/plus-16'
import { IconGithub16 } from '@hashicorp/flight-icons/svg-react/github-16'

const ICON_MAP = {
  'arrow-right': <IconArrowRight16 />,
  github: <IconGithub16 />,
  plus: <IconPlus16 />,
}

interface SwingsetTestIconProps {
  name: 'arrow-right' | 'github' | 'plus'
}

/**
 * 🚨 SwingsetTestIcons should only be used in Swingset pages 🚨
 */
const SwingsetTestIcon = ({ name }: SwingsetTestIconProps): ReactElement => {
  return ICON_MAP[name]
}

export default SwingsetTestIcon
