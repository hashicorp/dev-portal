export enum PlatformOptionTitles {
  'vault-io' = 'Vault',
  'waypoint-io' = 'Waypoint',
  learn = 'Learn',
}

export type OptInPlatformOption = keyof typeof PlatformOptionTitles

/**
 * Type guard to determine if a string is an OptInPlatformOption
 */
export function isOptInPlatformOption(
  string: string
): string is OptInPlatformOption {
  return Object.keys(PlatformOptionTitles).includes(
    string as OptInPlatformOption
  )
}
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
    cookieAnalyticsKey: string
  }
>
