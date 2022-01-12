import DevAlertBanner from 'components/dev-alert-banner'
import NavigationHeader from 'components/navigation-header'
import s from './base-new-layout.module.css'

const BaseNewLayout: React.FC = ({ children }) => {
  return (
    <>
      <div className={s.header}>
        <DevAlertBanner />
        <NavigationHeader />
      </div>

      {children}
    </>
  )
}

export default BaseNewLayout
