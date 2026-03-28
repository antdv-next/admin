import type { ConfigProviderProps } from 'antdv-next'
import { theme as themeConfig } from 'antdv-next'
import { useDarkMode } from '@/composables/dark.ts'

export function useTheme() {
  const { isDark } = useDarkMode()
  const theme = shallowRef<NonNullable<ConfigProviderProps['theme']>>({
    zeroRuntime: true,
  })
  watch(
    isDark,
    () => {
      if (isDark.value) {
        theme.value = {
          algorithm: [themeConfig.darkAlgorithm],
          zeroRuntime: true,
        }
      } else {
        theme.value = {
          zeroRuntime: true,
        }
      }
    },
    {
      immediate: true,
    },
  )
  return {
    theme,
  }
}
