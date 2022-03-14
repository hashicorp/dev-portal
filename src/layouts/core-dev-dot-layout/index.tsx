import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout: React.FC = ({ children }) => (
  <div className={s.root}>{children}</div>
)

export default CoreDevDotLayout
