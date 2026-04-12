import type { SysUser } from '#db/sys_user'

const MOCK_OPERATOR_ID = 'mock-system-admin'
const MOCK_OPERATOR_NAME = 'Mock System Admin'
const MOCK_TIMESTAMP = new Date('2026-04-12T09:00:00+08:00')

type UserSeedInput = Partial<SysUser> & Pick<SysUser, 'id' | 'nickname' | 'username'>

function createUserSeed(input: UserSeedInput): SysUser {
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
    nickname: input.nickname,
    username: input.username,
    password: input.password ?? '123456',
    lastEditPasswordTime: input.lastEditPasswordTime ?? null,
    editFirstPassword: input.editFirstPassword ?? 0,
    userSex: input.userSex ?? null,
    realName: input.realName ?? null,
    idNum: input.idNum ?? null,
    avatarFileId: input.avatarFileId ?? null,
    userEmail: input.userEmail ?? null,
    userPhone: input.userPhone ?? null,
    userStatus: input.userStatus ?? 0,
    loginLockInfo: input.loginLockInfo ?? null,
    periodOfValidity: input.periodOfValidity ?? null,
    userSource: input.userSource ?? 'user_source_system',
    webTheme: input.webTheme ?? null,
  }
}

const sysUserSeeds: SysUser[] = [
  createUserSeed({
    id: 'user-1',
    code: 'admin',
    nickname: '管理员',
    realName: '系统管理员',
    userEmail: 'admin@example.com',
    userPhone: '13800000001',
    userSex: 'user_sex_man',
    userStatus: 0,
    username: 'admin',
  }),
  createUserSeed({
    id: 'user-2',
    code: 'zhangsan',
    nickname: '张三',
    realName: '张三',
    userEmail: 'zhangsan@example.com',
    userPhone: '13800000002',
    userSex: 'user_sex_man',
    userStatus: 0,
    username: 'zhangsan',
  }),
  createUserSeed({
    id: 'user-3',
    code: 'lisi',
    nickname: '李四',
    realName: '李四',
    userEmail: 'lisi@example.com',
    userPhone: '13800000003',
    userSex: 'user_sex_woman',
    userStatus: 1,
    username: 'lisi',
  }),
]

export function cloneSysUserSeeds() {
  return sysUserSeeds.map(item => ({
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
    lastEditPasswordTime: item.lastEditPasswordTime ? new Date(item.lastEditPasswordTime) : null,
    periodOfValidity: item.periodOfValidity ? new Date(item.periodOfValidity) : null,
  }))
}
