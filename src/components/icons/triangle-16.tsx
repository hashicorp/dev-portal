import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTriangle16 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.978 1.515a2.101 2.101 0 012.807.731l.002.004 5.681 9.383a2.065 2.065 0 01-.751 2.832c-.314.183-.67.281-1.034.285H2.317a2.101 2.101 0 01-1.791-1.045 2.065 2.065 0 01.006-2.072l.006-.01L6.213 2.25l.002-.004c.187-.305.45-.557.763-.73zm.517 1.514l-.001.001-5.67 9.363a.565.565 0 00.214.776c.088.051.189.08.292.081h11.34a.601.601 0 00.504-.294.564.564 0 00.001-.563L8.506 3.03V3.03A.584.584 0 008 2.75a.601.601 0 00-.505.279z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
