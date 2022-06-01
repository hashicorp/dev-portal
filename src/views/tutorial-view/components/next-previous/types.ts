export interface LinkProps {
  name: string
  path: string
}

export interface NextPreviousProps {
  tutorial: {
    next?: LinkProps
    previous?: LinkProps
    isLast: boolean
  }
  collection: {
    current: LinkProps
    next?: LinkProps
    isLast: boolean
  }
  finalLink: string
}
