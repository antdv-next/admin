import type { UserConfig } from 'vite-plus'

export function loadSever(_mode: string, _baseUrl: string) {
  // 代理模式处理
  return {
    port: 6800,
    proxy: {},
  } as NonNullable<UserConfig['server']>
}
