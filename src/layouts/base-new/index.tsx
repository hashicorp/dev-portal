import DevAlertBanner from 'components/dev-alert-banner'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'
import Footer from 'components/footer'
import s from './base-new-layout.module.css'

interface BaseNewLayoutProps {
  /** Defaults to true. If true, the global footer will be shown at the bottom of the page. */
  showFooter?: boolean
  openConsentManager?: () => void
}

const BaseNewLayout: React.FC<BaseNewLayoutProps> = ({
  children,
  openConsentManager,
  showFooter = true,
}) => {
  return (
    <div className={s.root} data-layout="base-new">
      <div className={s.header}>
        <DevAlertBanner />
        <NavigationHeader />
      </div>
      <div className={s.contentArea}>{children}</div>
      {showFooter && (
        <div className={s.footer}>
          <Footer openConsentManager={openConsentManager} />
        </div>
      )}
    </div>
  )
}

export default BaseNewLayout
