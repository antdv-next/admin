import type { SysDict } from '#db/sys_dict_type'
import { http } from '@/utils/request'

export type DictInfo = SysDict

export function getGlobalDictListMethod() {
  return http.Get<R<DictInfo[]>>('/dict/list')
}

export function getDictListByCodeMethod(code: string | readonly string[]) {
  return http.Get<R<DictInfo[]>>('/dist/code/list', {
    params: {
      code,
    },
  })
}
