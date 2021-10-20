import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconChevronsUp16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M5.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5a.75.75 0 011.1 0l3.25 3.5a.75.75 0 11-1.1 1.02L8 4.852 5.3 7.76z" />
          <path d="M5.3 12.76a.75.75 0 11-1.1-1.02l3.25-3.5a.75.75 0 011.1 0l3.25 3.5a.75.75 0 11-1.1 1.02L8 9.852 5.3 12.76z" />
        </g>
      </svg>
    )
  }
)
