import s from './style.module.css'
import BaseNewLayout from 'layouts/base-new'

interface SidebarSidecarLayoutProps {
  /** Sidebar slot, displayed in an elevated area at the left of the viewport. If the content in the sidebar is very tall, it will overflow. */
  sidebar: React.ReactNode
  /** Optional sidecar slot, displayed closely alongside the centered content area. If the content in the sidecar is very tall, it will extend the height of the page. */
  sidecar?: React.ReactNode
  /** Option to show the global footer, via BaseNewLayout.
   * Note: Not used in current designs, though I think there's a possibility it will be used in the future, so wanted to ensure this implementation can accommodate it. */
  showFooter?: boolean
}

const SidebarSidecarLayout: React.FC<SidebarSidecarLayoutProps> = ({
  children,
  sidebar,
  sidecar,
  showFooter = false,
}) => {
  return (
    <BaseNewLayout showFooter={showFooter}>
      <div className={s.contentWrapper}>
        <div className={s.sidebar}>{sidebar}</div>
        <div className={s.mainArea}>
          <div className={s.main}>{children}</div>
          {sidecar && (
            <div className={`${s.sidecar} hide-on-mobile hide-on-tablet`}>
              {sidecar}
            </div>
          )}
        </div>
      </div>
    </BaseNewLayout>
  )
}

export default SidebarSidecarLayout
