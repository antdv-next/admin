function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formatPath(pathSegments: string[]) {
  return pathSegments.join('.')
}

export function mergeMessageTrees<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(left: T, right: U, pathSegments: string[] = []): T & U {
  const result: Record<string, unknown> = { ...left }

  for (const [key, rightValue] of Object.entries(right)) {
    const nextPath = [...pathSegments, key]
    const leftValue = result[key]

    if (leftValue === undefined) {
      result[key] = rightValue
      continue
    }

    if (Array.isArray(leftValue) || Array.isArray(rightValue)) {
      throw new Error(`[i18n] Array merge is not supported at "${formatPath(nextPath)}".`)
    }

    if (isPlainObject(leftValue) && isPlainObject(rightValue)) {
      result[key] = mergeMessageTrees(leftValue, rightValue, nextPath)
      continue
    }

    throw new Error(`[i18n] Duplicate locale message key "${formatPath(nextPath)}".`)
  }

  return result as T & U
}
