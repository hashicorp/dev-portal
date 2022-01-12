import AlertBanner from 'components/alert-banner'
import React, { useState } from 'react'
import Min100Layout from '@hashicorp/react-min-100-layout'
import classNames from 'classnames'
import s from './style.module.css'

function LayoutDev(): React.ReactElement {
  const [isLongMain, setIsLongMain] = useState(false)
  const [isLongSidebar, setIsLongSidebar] = useState(false)
  const [isLongSidecar, setIsLongSidecar] = useState(false)
  return (
    <div className={s.root}>
      <Min100Layout footer={<div className={s.footer}>FOOTER PLACEHOLDER</div>}>
        <div className={s.stickyBars}>
          <AlertBanner type="highlight">
            <p>
              You are viewing an internal preview and work in progress version
              of this site.{' '}
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
          <div className={s.header}>HEADER PLACEHOLDER</div>
        </div>
        <div className={s.sidebarMainSidecar}>
          <div className={s.sidebar}>
            <div
              className={classNames(s.sidebarContent, {
                [s.isLongSidebar]: isLongSidebar,
              })}
            >
              SIDEBAR CONTENT
              <br />
              <button
                type="button"
                onClick={() => setIsLongSidebar(!isLongSidebar)}
              >
                Demo {isLongSidebar ? 'Short' : 'Long'} Sidebar
              </button>
            </div>
          </div>
          <div className={s.mainSidecar}>
            <div className={s.main}>
              <div
                className={classNames(s.mainContent, {
                  [s.isLongMain]: isLongMain,
                })}
              >
                MAIN CONTENT
                <br />
                <button
                  type="button"
                  onClick={() => setIsLongMain(!isLongMain)}
                >
                  Demo {isLongMain ? 'Short' : 'Long'} Main
                </button>
              </div>
            </div>
            <div className={s.sidecar}>
              <div
                className={classNames(s.sidecarContent, {
                  [s.isLongSidecar]: isLongSidecar,
                })}
              >
                SIDECAR CONTENT
                <br />
                <button
                  type="button"
                  onClick={() => setIsLongSidecar(!isLongSidecar)}
                >
                  Demo {isLongSidecar ? 'Short' : 'Long'} Sidecar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Min100Layout>
    </div>
  )
}

LayoutDev.layout = ({ children }) => <div>{children}</div>
export default LayoutDev
