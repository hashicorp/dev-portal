import { ReactElement } from 'react'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import StandaloneLink from 'components/standalone-link'
import { SidebarBackToLinkProps } from './types'
import s from './sidebar-back-to-link.module.css'

/**
 * TODO: Design is still planning this functionality & states. Since not all
 * cases are covered, we return a placeholder link if necessary props aren't
 * provided.
 */
const SidebarBackToLink = ({
  text,
  url,
}: SidebarBackToLinkProps): ReactElement => {
  return (
    <StandaloneLink
      className={s.root}
      href={url}
      icon={<IconArrowLeft16 className={s.icon} />}
      iconPosition="leading"
      text={text}
    />
  )
}

export type { SidebarBackToLinkProps }
export default SidebarBackToLink
