import { ProductUsed as ClientProductUsed } from 'lib/learn-client/types'

export function getIsBeta(productsUsed: ClientProductUsed[]): boolean {
  let isBeta = false

  for (let i; i < productsUsed.length; i++) {
    if (productsUsed[i].isBeta) {
      isBeta = true
      break
    }
  }

  return isBeta
}
