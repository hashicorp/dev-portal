import Min100Layout from '@hashicorp/react-min-100-layout'
import Footer from 'components/footer'
import DevAlertBanner from 'components/dev-alert-banner'
import NavigationHeader from 'components/navigation-header'
import s from './base-new-layout.module.css'

const BaseNewLayout: React.FC = ({ children }) => {
  return (
    <Min100Layout footer={<Footer />}>
      <div className={s.header}>
        <DevAlertBanner />
        <NavigationHeader />
      </div>

      {children}
    </Min100Layout>
  )
}

export default BaseNewLayout
