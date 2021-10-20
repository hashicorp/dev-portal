import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconArrowUpLeft16 = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          d="M3.057 3.463A.748.748 0 013.75 3h5.5a.75.75 0 010 1.5H5.56l7.22 7.22a.75.75 0 11-1.06 1.06L4.5 5.56v3.69a.75.75 0 01-1.5 0v-5.5c0-.102.02-.199.057-.287z"
        />
      </svg>
    )
  }
)
