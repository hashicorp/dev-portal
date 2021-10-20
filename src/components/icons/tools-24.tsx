import { forwardRef } from 'react'
import { IconProps } from './types'

export const IconTools24 = forwardRef<SVGSVGElement, IconProps>(
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
          d="M7 6V4.75A2.75 2.75 0 019.75 2h4.5A2.75 2.75 0 0117 4.75V6h.422c.729 0 1.428.29 1.944.805l2.829 2.829A2.75 2.75 0 0123 11.578v7.672A2.75 2.75 0 0120.25 22H3.75A2.75 2.75 0 011 19.25v-7.672c0-.729.29-1.428.805-1.944l2.829-2.829A2.75 2.75 0 016.578 6H7zm1.5-1.25c0-.69.56-1.25 1.25-1.25h4.5c.69 0 1.25.56 1.25 1.25V6h-7V4.75zM6.578 7.5c-.331 0-.649.132-.883.366l-2.829 2.829a1.25 1.25 0 00-.366.883V13H9v-.75c0-.69.56-1.25 1.25-1.25h3.5c.69 0 1.25.56 1.25 1.25V13h6.5v-1.422c0-.331-.132-.649-.366-.883l-2.829-2.829a1.25 1.25 0 00-.883-.366H6.578zM15 15.75V14.5h6.5v4.75c0 .69-.56 1.25-1.25 1.25H3.75c-.69 0-1.25-.56-1.25-1.25V14.5H9v1.25c0 .69.56 1.25 1.25 1.25h3.5c.69 0 1.25-.56 1.25-1.25zm-4.5-3.25v3h3v-3h-3z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
