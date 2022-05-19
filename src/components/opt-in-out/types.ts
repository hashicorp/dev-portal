export enum PlatformOptionTitles {
  'vault-io' = 'Vault',
  'waypoint-io' = 'Waypoint',
  learn = 'Learn',
}

export type OptInPlatformOption = keyof typeof PlatformOptionTitles

export interface OptInOutProps {
  platform: OptInPlatformOption
  redirectPath?: string
}

export type PlatformOptionRedirectData = Record<
  OptInPlatformOption,
  {
    base_url: string
    getRedirectPath: (currentPath?: string) => string
    cookieKey: string
  }
>
