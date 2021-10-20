import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconCornerDownRight16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 2.75a.75.75 0 011.5 0v4.5A1.75 1.75 0 005.75 9h5.69L9.22 6.78a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H5.75A3.25 3.25 0 012.5 7.25v-4.5z"
        />
      </svg>
    )
  }
)
