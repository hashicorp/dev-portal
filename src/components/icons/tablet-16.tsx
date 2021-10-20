import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTablet16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M8 11a1 1 0 100 2h.01a1 1 0 100-2H8z" />
          <path
            d="M2.25 1A2.25 2.25 0 000 3.25v9.5A2.25 2.25 0 002.25 15h11.5A2.25 2.25 0 0016 12.75v-9.5A2.25 2.25 0 0013.75 1H2.25zM1.5 3.25a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-9.5z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
