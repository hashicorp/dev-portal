import React, { useState } from 'react'
import classNames from 'classnames'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import s from './style.module.css'

function DemoContent({ name }: { name: string }): React.ReactElement {
  const [isLong, setIsLong] = useState(false)
  return (
    <div className={classNames(s[`${name}Demo`], { [s.isLong]: isLong })}>
      {name} Content
      <br />
      <button type="button" onClick={() => setIsLong(!isLong)}>
        Demo {isLong ? 'short' : 'long'} {name} Content
      </button>
    </div>
  )
}

function DemoLayoutDev(): React.ReactElement {
  return (
    <SidebarSidecarLayout
      header={
        <div className={s.headerDemo}>
          header Content (sticky, fixed height)
        </div>
      }
      sidebar={<DemoContent name="sidebar" />}
      sidecar={<DemoContent name="sidecar" />}
      footer={<DemoContent name="footer" />}
    >
      <DemoContent name="main" />
    </SidebarSidecarLayout>
  )
}

DemoLayoutDev.layout = ({ children }) => <>{children}</>
export default DemoLayoutDev
