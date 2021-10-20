import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconBarChart16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M12 2a1 1 0 011 1v10a1 1 0 11-2 0V3a1 1 0 011-1zM8 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1zM5 10a1 1 0 00-2 0v3a1 1 0 102 0v-3z" />
        </g>
      </svg>
    )
  }
)
