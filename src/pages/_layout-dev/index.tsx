import React, { useState } from 'react'
import classNames from 'classnames'
import SidebarSidecarLayout from 'layouts/docs/partials/sidebar-sidecar-layout'
import s from './style.module.css'

function DemoContent({
  name,
  showFooter,
  setShowFooter,
}: {
  name: string
  showFooter?: boolean
  setShowFooter?: (b: boolean) => void
}): React.ReactElement {
  const [isLong, setIsLong] = useState(false)
  return (
    <div className={classNames(s[`${name}Demo`], { [s.isLong]: isLong })}>
      {name} Content
      <br />
      <button type="button" onClick={() => setIsLong(!isLong)}>
        Demo {isLong ? 'short' : 'long'} {name} Content
      </button>
      <br />
      {setShowFooter && (
        <button type="button" onClick={() => setShowFooter(!showFooter)}>
          {showFooter ? 'Hide' : 'Show'} Footer
        </button>
      )}
    </div>
  )
}

function DemoLayoutDev(): React.ReactElement {
  const [showFooter, setShowFooter] = useState(false)

  return (
    <SidebarSidecarLayout
      showFooter={showFooter}
      sidebar={<DemoContent name="sidebar" />}
      sidecar={<DemoContent name="sidecar" />}
    >
      <DemoContent
        name="main"
        setShowFooter={setShowFooter}
        showFooter={showFooter}
      />
    </SidebarSidecarLayout>
  )
}

DemoLayoutDev.layout = ({ children }) => <>{children}</>
export default DemoLayoutDev
