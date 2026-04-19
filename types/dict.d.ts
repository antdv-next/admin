// Global dictionary code declarations.
// Add stable global dictionary codes here to improve `useDict` hints.
//
// Example:
// interface DictCodeRegistry {
//   global_status: true
//   tenant_type: true
// }

declare global {
  interface DictCodeRegistry {}

  type KnownGlobalDictCodeType = Extract<keyof DictCodeRegistry, string>
}

export type KnownGlobalDictCodeType = globalThis.KnownGlobalDictCodeType
