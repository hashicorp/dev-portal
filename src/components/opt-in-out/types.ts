import { OptInPlatformOption } from 'pages/_middleware'

export interface OptInOutProps {
  platform: OptInPlatformOption
  redirectPath?: string
}

export type PlatformOptionsType = Record<
  OptInPlatformOption,
  {
    base_url: string
    getRedirectPath: (currentPath?: string) => string
    cookieKey: string
  }
>
