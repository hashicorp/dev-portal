import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTrendDown24 = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
        ref={forwardedRef}
      >
        <path
          fill={color}
          d="M1.28 5.22A.75.75 0 00.22 6.28l7.5 7.5a.75.75 0 001.005.05L13.7 9.76l7.74 7.74h-4.69a.75.75 0 000 1.5h6.5a.75.75 0 00.75-.75v-6.5a.75.75 0 00-1.5 0v4.69l-8.22-8.22a.75.75 0 00-1.005-.05L8.3 12.24 1.28 5.22z"
        />
      </svg>
    )
  }
)
