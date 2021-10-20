import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconChevronsRight24 = forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color}>
          <path d="M5.232 16.707a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.036 1.086L10.164 12l-4.932 4.707z" />
          <path d="M12.232 16.707a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.036 1.086L17.164 12l-4.932 4.707z" />
        </g>
      </svg>
    )
  }
)
