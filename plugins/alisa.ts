import type { UserConfig } from 'vite'
import * as path from 'node:path'

export function loadAlias(baseUrl: string) {
  return [
    {
      find: '@',
      replacement: path.resolve(baseUrl, 'src'),
    },
    {
      find: '@apps/admin',
      replacement: path.resolve(baseUrl, 'apps/admin', 'src'),
    },
  ] as NonNullable<UserConfig['resolve']>['alias']
}
