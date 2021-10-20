import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconCheck24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M21.78 6.28a.75.75 0 00-1.06-1.06L8.75 17.19l-5.47-5.47a.75.75 0 00-1.06 1.06l6 6a.75.75 0 001.06 0l12.5-12.5z"
        />
      </svg>
    )
  }
)
