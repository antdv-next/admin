import type { UserConfig } from 'vite'
import * as path from 'node:path'

export function loadAlias(baseUrl: string) {
  return [
    {
      find: '@',
      replacement: path.resolve(baseUrl, 'src'),
    },
  ] as NonNullable<UserConfig['resolve']>['alias']
}
