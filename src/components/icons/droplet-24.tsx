import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconDroplet24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M12 1a.75.75 0 01.544.233l5.997 6.314A9.22 9.22 0 0121 13.84c0 5.045-4.016 9.16-9 9.16s-9-4.115-9-9.16c0-2.435.934-4.651 2.46-6.293l.005-.006 5.991-6.308A.75.75 0 0112 1zM6.556 8.571A7.719 7.719 0 004.5 13.84c0 4.244 3.371 7.66 7.5 7.66s7.5-3.416 7.5-7.66a7.719 7.719 0 00-2.056-5.269L12 2.84 6.556 8.571z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
