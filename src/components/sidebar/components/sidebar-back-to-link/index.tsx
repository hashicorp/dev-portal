import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import MaybeInternalLink from 'components/maybe-internal-link'
import s from './style.module.css'

// TODO: design is still planning this functionality & states
const SidebarBackToLink: React.FC<{
  text?: string
  url?: string
}> = ({ text = 'Back to lorem ipsum', url = '/' }) => (
  <MaybeInternalLink className={s.backToLink} href={url}>
    <IconArrowLeft16 className={s.icon} />
    <span>{text}</span>
  </MaybeInternalLink>
)

export default SidebarBackToLink
