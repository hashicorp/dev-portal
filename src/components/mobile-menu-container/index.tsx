import { ForwardedRef, forwardRef } from 'react'
import classNames from 'classnames'
import { motion, useReducedMotion } from 'framer-motion'
import { useDeviceSize, useMobileMenu } from 'contexts'
import { MobileMenuContainerProps } from './types'
import s from './mobile-menu-container.module.css'

const MOBILE_MENU_MOTION = {
  visible: {
    left: 0,
    display: 'block',
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
    // hooks
    const { isDesktop } = useDeviceSize()
    const { mobileMenuIsOpen } = useMobileMenu()
    const shouldReduceMotion = useReducedMotion()

    // variables
    const mobileMenuIsVisible = isDesktop || mobileMenuIsOpen
    const classes = classNames(s.root, className)

    return (
      <motion.div
        animate={mobileMenuIsVisible ? 'visible' : 'hidden'}
        className={classes}
        ref={ref}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        variants={MOBILE_MENU_MOTION}
      >
        {children}
      </motion.div>
    )
  }
)

export type { MobileMenuContainerProps }
export default MobileMenuContainer
