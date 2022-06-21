import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classnames'
import { m, useReducedMotion } from 'framer-motion'
import { useMobileMenu } from 'contexts'
import { MobileMenuContainerProps } from './types'
import s from './mobile-menu-container.module.css'

const MOBILE_MENU_MOTION = {
  visible: {
    left: 0,
    display: 'flex',
  },
  hidden: {
    left: '-150vw',
    transitionEnd: {
      display: 'none',
    },
  },
}

// eslint-disable-next-line react/display-name
const MobileMenuContainer = forwardRef(
  (
    { children, className }: MobileMenuContainerProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { mobileMenuIsOpen } = useMobileMenu()
    const shouldReduceMotion = useReducedMotion()

    return (
      <m.div
        animate={mobileMenuIsOpen ? 'visible' : 'hidden'}
        className={classNames(s.root, className)}
        ref={ref}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        variants={MOBILE_MENU_MOTION}
      >
        {children}
      </m.div>
    )
  }
)

export type { MobileMenuContainerProps }
export default MobileMenuContainer
