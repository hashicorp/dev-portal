import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconCornerLeftDown24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M20.25 2.5a.75.75 0 010 1.5h-7c-.847 0-1.669.357-2.282 1.009A3.639 3.639 0 0010 7.5v10.878l3.957-4.146a.75.75 0 011.085 1.036l-5.25 5.5a.75.75 0 01-1.085 0l-5.25-5.5a.75.75 0 011.086-1.036L8.5 18.378V7.5c0-1.312.49-2.579 1.375-3.52A4.634 4.634 0 0113.25 2.5h7z"
        />
      </svg>
    )
  }
)
