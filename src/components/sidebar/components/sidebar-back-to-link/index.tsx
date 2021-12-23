import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import Link from 'next/link'
import s from './style.module.css'

// TODO: design is still planning this functionality & states
const SidebarBackToLink: React.FC = () => (
  <Link href="/">
    <a className={s.backToLink}>
      <IconArrowLeft16 className={s.icon} />
      <span>Home</span>
    </a>
  </Link>
)

export default SidebarBackToLink
