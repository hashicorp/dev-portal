import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconChevronDown24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.23 8.21a.75.75 0 011.06.02L12 14.168l5.71-5.938a.75.75 0 111.08 1.04l-6.25 6.5a.75.75 0 01-1.08 0l-6.25-6.5a.75.75 0 01.02-1.06z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
