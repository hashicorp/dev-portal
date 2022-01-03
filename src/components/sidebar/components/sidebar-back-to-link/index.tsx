import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import s from './style.module.css'

// TODO: design is still planning this functionality & states
const SidebarBackToLink: React.FC = () => (
  <a className={s.backToLink}>
    <IconArrowLeft16 className={s.icon} />
    <span>Back to lorem ipsum</span>
  </a>
)

export default SidebarBackToLink
