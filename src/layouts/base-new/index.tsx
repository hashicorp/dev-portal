import DevAlertBanner from 'components/dev-alert-banner'
import NavigationHeader from 'components/navigation-header'

const BaseNewLayout: React.FC = ({ children }) => {
  return (
    <>
      <DevAlertBanner />
      <NavigationHeader />
      {children}
    </>
  )
}

export default BaseNewLayout
