import Icon from 'components/icons'
import s from './style.module.css'

// TODO: design is still planning this functionality & states
const BackToLink: React.FC = () => (
  <a className={s.backToLink}>
    <Icon className={s.icon} name="arrow-left" />
    <span>Back to lorem ipsum</span>
  </a>
)

export default BackToLink
