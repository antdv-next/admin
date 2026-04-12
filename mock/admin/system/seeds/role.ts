import type { SysRole } from '#db/sys_role'

const MOCK_OPERATOR_ID = 'mock-system-admin'
const MOCK_OPERATOR_NAME = 'Mock System Admin'
const MOCK_TIMESTAMP = new Date('2026-04-12T09:00:00+08:00')

type RoleSeedInput = Partial<SysRole> & Pick<SysRole, 'id' | 'roleName'>

function createRoleSeed(input: RoleSeedInput): SysRole {
  return {
    id: input.id,
    createId: input.createId ?? MOCK_OPERATOR_ID,
    createName: input.createName ?? MOCK_OPERATOR_NAME,
    createTime: input.createTime ?? new Date(MOCK_TIMESTAMP),
    updateId: input.updateId ?? MOCK_OPERATOR_ID,
    updateName: input.updateName ?? MOCK_OPERATOR_NAME,
    updateTime: input.updateTime ?? new Date(MOCK_TIMESTAMP),
    code: input.code ?? null,
    isDelete: input.isDelete ?? false,
    roleName: input.roleName,
    dataScope: input.dataScope ?? 'data_scope_all',
    roleStatus: input.roleStatus ?? 0,
    roleType: input.roleType ?? 'role_type_normal',
    remark: input.remark ?? null,
  }
}

const sysRoleSeeds: SysRole[] = [
  createRoleSeed({
    id: 'role-1',
    code: 'admin',
    dataScope: 'data_scope_all',
    roleName: '超级管理员',
    roleStatus: 0,
    roleType: 'role_type_admin',
    remark: '系统内置角色',
  }),
  createRoleSeed({
    id: 'role-2',
    code: 'ops',
    dataScope: 'data_scope_custom',
    roleName: '运维角色',
    roleStatus: 0,
    roleType: 'role_type_normal',
    remark: '负责系统配置与巡检',
  }),
  createRoleSeed({
    id: 'role-3',
    code: 'auditor',
    dataScope: 'data_scope_self',
    roleName: '审计角色',
    roleStatus: 1,
    roleType: 'role_type_normal',
    remark: '只读审计权限',
  }),
]

export function cloneSysRoleSeeds() {
  return sysRoleSeeds.map(item => ({
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }))
}
