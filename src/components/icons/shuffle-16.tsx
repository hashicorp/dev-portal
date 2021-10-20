import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconShuffle16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M14.943 1.463a.748.748 0 00-.161-.242l-.002-.001-.001-.002A.748.748 0 0014.25 1h-4a.75.75 0 000 1.5h2.19L1.22 13.72a.75.75 0 101.06 1.06L13.5 3.56v2.19a.75.75 0 001.5 0v-4a.747.747 0 00-.057-.287zM9.5 14.25c0 .414.336.75.75.75h4a.747.747 0 00.75-.75v-4a.75.75 0 00-1.5 0v2.19l-2.47-2.47a.75.75 0 10-1.06 1.06l2.47 2.47h-2.19a.75.75 0 00-.75.75zM6.03 4.97a.75.75 0 01-1.06 1.06L1.22 2.28a.75.75 0 011.06-1.06l3.75 3.75z" />
        </g>
      </svg>
    )
  }
)
