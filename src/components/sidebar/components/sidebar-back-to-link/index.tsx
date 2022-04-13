import { ReactElement } from 'react'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import StandaloneLink from 'components/standalone-link'
import { SidebarBackToLinkProps } from './types'
import s from './sidebar-back-to-link.module.css'

const SidebarBackToLink = ({
  text,
  url,
}: SidebarBackToLinkProps): ReactElement => {
  return (
    <div className={s.root}>
      <StandaloneLink
        href={url}
        icon={<IconArrowLeft16 className={s.icon} />}
        iconPosition="leading"
        text={text}
      />
    </div>
  )
}

export type { SidebarBackToLinkProps }
export default SidebarBackToLink
