import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconArrowLeftCircle16 = forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.755 4.695a.75.75 0 01.05 1.06L6.445 7.25h4.805a.75.75 0 010 1.5H6.445l1.36 1.495a.75.75 0 01-1.11 1.01l-2.499-2.75A.747.747 0 014 8.003v-.004c0-.195.075-.372.197-.505l2.498-2.748a.75.75 0 011.06-.05z" />
          <path
            d="M0 8a8 8 0 1116 0A8 8 0 010 8zm8-6.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
