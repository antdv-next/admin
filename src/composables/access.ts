import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

function normalizeAccessInput(auth: PerCodeType | readonly PerCodeType[]) {
  return Array.isArray(auth) ? auth : [auth]
}

export function useAccess() {
  const userStore = useUserStore()
  const { permissions } = storeToRefs(userStore)
  const permissionSet = computed(() => new Set(permissions.value))

  function hasAllAccess(auth: PerCodeType | readonly PerCodeType[]) {
    const codes = normalizeAccessInput(auth)
    return codes.every(code => permissionSet.value.has(code))
  }

  function hasAnyAccess(auth: PerCodeType | readonly PerCodeType[]) {
    const codes = normalizeAccessInput(auth)
    return codes.some(code => permissionSet.value.has(code))
  }

  function hasAccess(auth: PerCodeType | readonly PerCodeType[], mode: 'all' | 'any' = 'all') {
    return mode === 'any' ? hasAnyAccess(auth) : hasAllAccess(auth)
  }

  return {
    permissions,
    hasAccess,
    hasAnyAccess,
    hasAllAccess,
  }
}
