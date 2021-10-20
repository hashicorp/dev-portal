import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconCornerDownRight24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 3.75a.75.75 0 011.5 0v7c0 .847.357 1.669 1.009 2.282A3.639 3.639 0 007.5 14h10.878l-4.146-3.957a.75.75 0 011.036-1.086l5.498 5.25a.748.748 0 01.002 1.085l-5.5 5.25a.75.75 0 01-1.036-1.085l4.146-3.957H7.5a5.139 5.139 0 01-3.52-1.375A4.634 4.634 0 012.5 10.75v-7z"
        />
      </svg>
    )
  }
)
