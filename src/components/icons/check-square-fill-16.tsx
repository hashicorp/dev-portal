import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconCheckSquareFill16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.25 1A2.25 2.25 0 001 3.25v9.5A2.25 2.25 0 003.25 15h9.5A2.25 2.25 0 0015 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5zm7.47 4.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06l1.47 1.47 3.97-3.97z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
