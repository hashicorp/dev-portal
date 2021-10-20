import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconConnection16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M0 7.75A3 3 0 015.905 7h4.19a3.001 3.001 0 110 1.5h-4.19A3.001 3.001 0 010 7.75zm3-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
