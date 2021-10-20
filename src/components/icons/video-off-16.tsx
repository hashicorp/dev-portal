import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconVideoOff16 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
        ref={forwardedRef}
      >
        <g fill={color}>
          <path
            d="M2.28 1.22a.75.75 0 00-1.06 1.06l.738.739A2.25 2.25 0 000 5.25v5.5A2.25 2.25 0 002.25 13h6.5a2.25 2.25 0 001.99-1.2l2.98 2.98a.75.75 0 101.06-1.06L2.28 1.22zm7.22 9.34L3.44 4.5H2.25a.75.75 0 00-.75.75v5.5c0 .414.336.75.75.75h6.5a.75.75 0 00.75-.75v-.19z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path d="M7.688 3a.75.75 0 000 1.5H8.75a.75.75 0 01.75.75v.733a1.544 1.544 0 002.424 1.27L14.5 5.47v5.54a.75.75 0 001.5 0V4.99c0-1.021-1.157-1.61-1.982-1.013L11.07 6.02a.045.045 0 01-.07-.037V5.25A2.25 2.25 0 008.75 3H7.687z" />
        </g>
      </svg>
    )
  }
)
