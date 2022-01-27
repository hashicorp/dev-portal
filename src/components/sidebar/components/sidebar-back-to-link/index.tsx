import DevPopover from 'components/dev-popover'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import MaybeInternalLink from 'components/maybe-internal-link'
import Text from 'components/text'
import s from './style.module.css'

const BackToLinkText: React.FC = ({ children }) => (
  <Text asElement="span" size={200} weight="medium">
    {children}
  </Text>
)

// TODO: Design is still planning this functionality & states.
// TODO: Since not all cases are covered, we return a placeholder
// TODO: link if necessary props aren't provided.
const SidebarBackToLink: React.FC<{
  text?: string
  url?: string
}> = ({ text, url }) => {
  if (!text || !url) return <PlaceholderBackToLink />
  return (
    <MaybeInternalLink className={s.backToLink} href={url}>
      <IconArrowLeft16 className={s.icon} />
      <BackToLinkText>{text}</BackToLinkText>
    </MaybeInternalLink>
  )
}

const PlaceholderBackToLink: React.FC = () => {
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
        <BackToLinkText>Back to [Page]</BackToLinkText>
      </div>
    </DevPopover>
  )
}

export default SidebarBackToLink
