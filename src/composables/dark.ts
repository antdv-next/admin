export type DarkMode = 'light' | 'dark' | 'auto'

export const useDarkMode = createGlobalState(() => {
  const { system, store } = useColorMode({
    storageKey: 'antdv-color-scheme',
    initialValue: 'light' as DarkMode,
  })

  const isDark = computed(() =>
    store.value === 'auto' ? system.value === 'dark' : store.value === 'dark',
  )

  function toggleDark(value?: boolean) {
    store.value = (value ?? !isDark.value) ? 'dark' : 'light'
  }

  return {
    darkMode: store as Ref<DarkMode>,
    isDark,
    toggleDark,
  }
})
