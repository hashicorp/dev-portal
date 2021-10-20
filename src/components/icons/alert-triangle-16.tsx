import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconAlertTriangle16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7 11a1 1 0 011-1h.007a1 1 0 110 2H8a1 1 0 01-1-1zM8.75 5.75a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" />
          <path
            d="M6.953 1.273a2.143 2.143 0 012.874.751l.002.004 5.884 9.774a2.126 2.126 0 01-.768 2.905c-.322.188-.687.289-1.06.293H2.115a2.143 2.143 0 01-1.833-1.074 2.125 2.125 0 01.006-2.124l.006-.01 5.878-9.764.002-.004c.191-.313.46-.571.78-.75zm.502 1.53l-.001.002-5.872 9.754a.626.626 0 00.231.853.644.644 0 00.314.088h11.746a.643.643 0 00.544-.32.626.626 0 000-.62l-5.87-9.755-.002-.001A.635.635 0 008 2.5a.643.643 0 00-.545.304z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
