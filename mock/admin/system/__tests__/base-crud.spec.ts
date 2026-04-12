import { describe, expect, it } from 'vite-plus/test'

describe('mock admin system base crud', () => {
  it('supports config list, detail, save, and delete', async () => {
    const configMock = (await import('../config')).default

    const listHandler = configMock.data['[POST]/admin/system/config']
    const infoHandler = configMock.data['[GET]/admin/system/config/{id}']
    const saveHandler = configMock.data['[POST]/admin/system/config/save']
    const deleteHandler = configMock.data['[POST]/admin/system/config/delete']

    expect(typeof listHandler).toBe('function')
    expect(typeof infoHandler).toBe('function')
    expect(typeof saveHandler).toBe('function')
    expect(typeof deleteHandler).toBe('function')

    const created = await (
      saveHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        configKey: 'app.theme',
        configName: '主题配置',
        configSource: 'config_source_custom',
        configType: 'ui',
        configValue: 'light',
        id: '',
      },
      headers: {},
      params: {},
      query: {},
    })

    const id = created.body.data.id
    expect(id).toBeTruthy()

    const detail = await (
      infoHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {},
      headers: {},
      params: { id },
      query: {},
    })

    expect(detail.body.data).toMatchObject({
      configKey: 'app.theme',
      configName: '主题配置',
    })

    const list = await (
      listHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: { page: 1, pageSize: 10, configKey: 'app.theme' },
      headers: {},
      params: {},
      query: {},
    })

    expect(list.body.data.list.some((item: any) => item.id === id)).toBe(true)

    const deleted = await (
      deleteHandler as (
        ...args: any[]
      ) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: { id },
      headers: {},
      params: {},
      query: {},
    })

    expect(deleted.body.data).toMatchObject({ id })
  })

  it('supports dict list, detail, save, and delete', async () => {
    const dictMock = (await import('../dict')).default

    const listHandler = dictMock.data['[POST]/admin/system/dict']
    const infoHandler = dictMock.data['[GET]/admin/system/dict/{id}']
    const saveHandler = dictMock.data['[POST]/admin/system/dict/save']
    const deleteHandler = dictMock.data['[POST]/admin/system/dict/delete']

    expect(typeof listHandler).toBe('function')
    expect(typeof infoHandler).toBe('function')
    expect(typeof saveHandler).toBe('function')
    expect(typeof deleteHandler).toBe('function')

    const created = await (
      saveHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        code: 'user_status_enabled',
        dictSource: 'dict_source_custom',
        dictStatus: 0,
        id: '',
        label: '启用',
        parentId: null,
        sort: 1,
        value: 'enabled',
      },
      headers: {},
      params: {},
      query: {},
    })

    const id = created.body.data.id
    expect(id).toBeTruthy()

    const detail = await (
      infoHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {},
      headers: {},
      params: { id },
      query: {},
    })

    expect(detail.body.data).toMatchObject({
      code: 'user_status_enabled',
      label: '启用',
    })

    const deleted = await (
      deleteHandler as (
        ...args: any[]
      ) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: { id },
      headers: {},
      params: {},
      query: {},
    })

    expect(deleted.body.data).toMatchObject({ id })
  })

  it('supports role list, detail, save, and delete', async () => {
    const roleMock = (await import('../role')).default

    const listHandler = roleMock.data['[POST]/admin/system/role']
    const infoHandler = roleMock.data['[GET]/admin/system/role/{id}']
    const saveHandler = roleMock.data['[POST]/admin/system/role/save']
    const deleteHandler = roleMock.data['[POST]/admin/system/role/delete']

    expect(typeof listHandler).toBe('function')
    expect(typeof infoHandler).toBe('function')
    expect(typeof saveHandler).toBe('function')
    expect(typeof deleteHandler).toBe('function')

    const created = await (
      saveHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        code: 'auditor',
        dataScope: 'data_scope_all',
        id: '',
        roleName: '审计员',
        roleStatus: 0,
        roleType: 'role_type_normal',
      },
      headers: {},
      params: {},
      query: {},
    })

    const id = created.body.data.id
    expect(id).toBeTruthy()

    const detail = await (
      infoHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {},
      headers: {},
      params: { id },
      query: {},
    })

    expect(detail.body.data).toMatchObject({
      code: 'auditor',
      roleName: '审计员',
    })

    const deleted = await (
      deleteHandler as (
        ...args: any[]
      ) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: { id },
      headers: {},
      params: {},
      query: {},
    })

    expect(deleted.body.data).toMatchObject({ id })
  })

  it('supports user list, detail, save, and delete', async () => {
    const userMock = (await import('../user')).default

    const listHandler = userMock.data['[POST]/admin/system/user']
    const infoHandler = userMock.data['[GET]/admin/system/user/{id}']
    const saveHandler = userMock.data['[POST]/admin/system/user/save']
    const deleteHandler = userMock.data['[POST]/admin/system/user/delete']

    expect(typeof listHandler).toBe('function')
    expect(typeof infoHandler).toBe('function')
    expect(typeof saveHandler).toBe('function')
    expect(typeof deleteHandler).toBe('function')

    const created = await (
      saveHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {
        id: '',
        nickname: '小王',
        realName: '王小明',
        userEmail: 'wang@example.com',
        userPhone: '13800000000',
        userSex: 'user_sex_man',
        userStatus: 0,
        username: 'wang',
      },
      headers: {},
      params: {},
      query: {},
    })

    const id = created.body.data.id
    expect(id).toBeTruthy()

    const detail = await (
      infoHandler as (...args: any[]) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: {},
      headers: {},
      params: { id },
      query: {},
    })

    expect(detail.body.data).toMatchObject({
      nickname: '小王',
      username: 'wang',
    })

    const deleted = await (
      deleteHandler as (
        ...args: any[]
      ) => Promise<{ body: { data: any } }> | { body: { data: any } }
    )({
      data: { id },
      headers: {},
      params: {},
      query: {},
    })

    expect(deleted.body.data).toMatchObject({ id })
  })
})
