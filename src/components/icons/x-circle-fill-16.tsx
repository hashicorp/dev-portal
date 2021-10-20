import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconXCircleFill16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 .25a7.75 7.75 0 100 15.5A7.75 7.75 0 008 .25zm2.72 3.97a.75.75 0 111.06 1.06L9.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 01-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 011.06-1.06L8 6.94l2.72-2.72z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
