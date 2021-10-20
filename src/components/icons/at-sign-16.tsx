import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconAtSign16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.818.21a8 8 0 103.046 14.141.75.75 0 10-.912-1.19A6.5 6.5 0 1114.5 8v1c0 .908-.54 1.5-1.25 1.5-.4 0-.691-.157-.894-.399C12.142 9.847 12 9.463 12 9V4.75a.75.75 0 00-1.5 0v.127a4 4 0 10.449 5.825c.076.128.162.25.258.364.484.577 1.194.934 2.043.934C15.04 12 16 10.461 16 9V8A8 8 0 009.818.21zM10.5 8a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
