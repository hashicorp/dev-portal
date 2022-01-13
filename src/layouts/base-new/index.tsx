import classNames from 'classnames'
import DevAlertBanner from 'components/dev-alert-banner'
import NavigationHeader from 'components/navigation-header'
import Footer from 'components/footer'
import s from './base-new-layout.module.css'

interface BaseNewLayoutProps {
  /** Defaults to true. If true, the global footer will be shown at the bottom of the page. */
  showFooter?: boolean
}

const BaseNewLayout: React.FC<BaseNewLayoutProps> = ({
  children,
  showFooter = true,
}) => {
  return (
    <div className={s.root}>
      <div className={s.header}>
        <DevAlertBanner />
        <NavigationHeader />
      </div>
      <div
        className={classNames(s.contentArea, { [s.showFooter]: showFooter })}
      >
        {children}
      </div>
      {showFooter && (
        <div className={s.footer}>
          <Footer />
        </div>
      )}
    </div>
  )
}

export default BaseNewLayout
