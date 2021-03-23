export const hasKey = (obj: Record<string, any>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key)

export const isObject = (obj: any): boolean =>
  Object.prototype.toString.call(obj) === '[object Object]'

/**
 * Get a nested object using dotted notation
 * For missing/invalid paths return the deepest valid object available.
 *
 * @param obj
 * @param path
 * @returns
 */
export const getNestedObject = (
  obj: Record<string, any>,
  path: string = null,
): Record<string, any> => {
  if (!path || typeof path !== 'string') {
    return obj
  }

  const levels = path.split('.')
  let currentObject = obj
  for (const level of levels) {
    if (!hasKey(currentObject, level) || !isObject(currentObject[level])) {
      break
    }

    currentObject = currentObject[level]
  }

  return currentObject
}
