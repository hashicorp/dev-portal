import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconChevronLeft16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.795 3.235a.75.75 0 01-.03 1.06L6.842 8l3.923 3.705a.75.75 0 01-1.03 1.09l-4.5-4.25a.75.75 0 010-1.09l4.5-4.25a.75.75 0 011.06.03z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
