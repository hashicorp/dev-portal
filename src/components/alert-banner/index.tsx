import classNames from 'classnames'
import s from './style.module.css'

interface AlertBannerProps {
  type: 'action' | 'danger' | 'highlight' | 'success' | 'warning'
}

/**
 * This is currently built to accept children (instead of several props like react-components/alert-banner)
 * because we have designs for future uses of this component that will accept things like inline code blocks,
 * bold text, and inline links.
 *
 * This is currently not dismissible because its only use is as a global banner noting that the site is a WIP
 * and accepting feedback.
 */
const AlertBanner: React.FC<AlertBannerProps> = ({ children, type }) => {
  const className = classNames(s.alertBanner, {
    [s[`${type}AlertBanner`]]: !!type,
  })
  return <div className={className}>{children}</div>
}

export default AlertBanner
