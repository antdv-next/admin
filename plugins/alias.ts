import * as path from 'node:path'
import type { UserConfig } from 'vite-plus'

export function loadAlias(baseUrl: string) {
  return [
    {
      find: '@',
      replacement: path.resolve(baseUrl, 'src'),
    },
    {
      find: '@apps/admin',
      replacement: path.resolve(baseUrl, 'apps/admin'),
    },
  ] as NonNullable<UserConfig['resolve']>['alias']
}
