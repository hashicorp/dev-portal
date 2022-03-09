export function splitProductFromFilename(slug: string): string {
  return slug.split('/')[1]
}
