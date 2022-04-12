import { ReactElement } from 'react'
import DevPopover from 'components/dev-popover'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import Text from 'components/text'
import { SidebarBackToLinkProps } from './types'
import s from './sidebar-back-to-link.module.css'
import StandaloneLink from 'components/standalone-link'

/**
 * TODO: Design is still planning this functionality & states. Since not all
 * cases are covered, we return a placeholder link if necessary props aren't
 * provided.
 */
const SidebarBackToLink = ({
  text,
  url,
}: SidebarBackToLinkProps): ReactElement => {
  if (!text || !url) {
    return <PlaceholderBackToLink />
  }

  return (
    <StandaloneLink
      href={url}
      icon={<IconArrowLeft16 className={s.icon} />}
      iconPosition="leading"
      text={text}
      textSize={200}
    />
  )
}

const PlaceholderBackToLink = (): ReactElement => {
  return (
    <DevPopover
      buttonClassName={s.popoverButton}
      title="Work in progress"
      note={
        <>
          We are still ironing out the functionality of this component and how
          it should behave on the various subpages for each product.
          <br />
          <br />
          We&apos;re also working on UI polish. You can{' '}
          <a href="https://www.figma.com/file/VD7ahvXuXWJApeGnhbW4hv/Dev-Portal?node-id=1498%3A43240">
            view the revised designs in Figma
          </a>
          .
        </>
      }
    >
      <div className={s.backToLink}>
        <IconArrowLeft16 className={s.icon} />
        <Text asElement="span" size={200} weight="medium">
          Back to [Page]
        </Text>
      </div>
    </DevPopover>
  )
}

export type { SidebarBackToLinkProps }
export default SidebarBackToLink
