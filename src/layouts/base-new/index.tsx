import AlertBanner from 'components/alert-banner'
import Footer from 'components/footer'
import NavigationHeader from 'components/navigation-header'
import s from './base-new-layout.module.css'
interface BaseNewLayoutProps {
  showFooter?: boolean
  openConsentManager?: () => void
}

const BaseNewLayout: React.FC<BaseNewLayoutProps> = ({
  children,
  openConsentManager,
  showFooter,
}) => {
  return (
    <div className={s.baseNewLayout}>
      <AlertBanner type="highlight">
        <p>
          You are viewing an internal preview and work in progress version of
          this site.{' '}
          <a
            href="https://airtable.com/shrU3eYHIOXO60o23"
            rel="noopener noreferrer"
            target="_blank"
          >
            We&apos;d love to hear your feedback
          </a>
          !
        </p>
      </AlertBanner>
      <NavigationHeader />
      {children}
      {showFooter && (
        <div className={s.footerContainer}>
          <Footer openConsentManager={openConsentManager} />
        </div>
      )}
    </div>
  )
}

export default BaseNewLayout
