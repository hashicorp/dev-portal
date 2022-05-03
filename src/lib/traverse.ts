// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandleNode<TValue = any> = (
  k: string | number | symbol,
  v: TValue
) => TValue

async function visitObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TObject extends Record<string, any> = Record<string, unknown>
>(objectIn: TObject, handleNode: HandleNode): Promise<TObject> {
  const objectOut = { ...objectIn }
  const objectKeys = Object.keys(objectIn)
  for (let i = 0; i < objectKeys.length; i++) {
    const key: keyof TObject = objectKeys[i]
    objectOut[key] = await visitProperty(key, objectIn[key], handleNode)
  }
  return objectOut as TObject
}

async function visitProperty<TValue>(
  key: string | number | symbol | false,
  value: TValue,
  handleNode: HandleNode<TValue>
): Promise<TValue> {
  const handledValue = await handleNode(key || '', value)
  if (isObject(handledValue)) {
    return await visitObject(handledValue, handleNode)
  } else if (Array.isArray(handledValue)) {
    return (await Promise.all(
      handledValue.map((v) => visitProperty(key, v, handleNode))
    )) as unknown as TValue
  } else {
    return handledValue
  }
}

// Returns true if a value is an object, false otherwise
export function isObject<T>(
  value: unknown | Record<string, T>
): value is Record<string, T> {
  return Boolean(
    value && typeof value === 'object' && value.constructor === Object
  )
}

export async function traverse<TValue, TObject extends Record<string, TValue>>(
  valueIn: unknown | TObject,
  handleNode: HandleNode = (_k, v) => v
): Promise<TObject> {
  return await visitProperty(false, valueIn, handleNode)
}
