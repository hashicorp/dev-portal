import s from './style.module.css'

interface SidebarSidecarLayoutProps {
  header: $TSFixMe
  sidebar: $TSFixMe
  sidecar?: $TSFixMe
  footer?: $TSFixMe
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
