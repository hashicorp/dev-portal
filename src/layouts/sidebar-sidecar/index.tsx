import s from './style.module.css'

interface SidebarSidecarLayoutProps {
  /** Header slot. Wrapped in a position: sticky container, elements in this area will always be visible. */
  header: React.ReactNode
  /** Sidebar slot, displayed in an elevated area at the left of the viewport. If the content in the sidebar is very tall, it will overflow. */
  sidebar: React.ReactNode
  /** Optional sidecar slot, displayed closely alongside the centered content area. If the content in the sidecar is very tall, it will extend the height of the page. */
  sidecar?: React.ReactNode
  /** Optional footer slot, to display below the sidebar + content + sidecar area. If the page content is shorter than 100vh, the footer will still be displayed at the bottom of the viewport.
   * Note: Not used in current designs, though I think there's a possibility it will be used in the future, so wanted to ensure this implementation can accommodate it. */
  footer?: React.ReactNode
}

const SidebarSidecarLayout: React.FC<SidebarSidecarLayoutProps> = ({
  children,
  sidebar,
  sidecar,
  header,
  footer,
}) => {
  return (
    <div className={s.root}>
      <div className={s.header}>{header}</div>
      <div className={s.contentArea}>
        <div className={s.sidebar}>{sidebar}</div>
        <div className={s.mainArea}>
          <div className={s.main}>{children}</div>
          {sidecar && <div className={s.sidecar}>{sidecar}</div>}
        </div>
      </div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  )
}

export default SidebarSidecarLayout
