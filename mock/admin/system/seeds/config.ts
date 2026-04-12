import type { SysConfig } from '#db/sys_config'

const MOCK_OPERATOR_ID = 'mock-system-admin'
const MOCK_OPERATOR_NAME = 'Mock System Admin'
const MOCK_TIMESTAMP = new Date('2026-04-12T09:00:00+08:00')

type ConfigSeedInput = Partial<SysConfig> & Pick<SysConfig, 'id' | 'configKey' | 'configName'>

function createConfigSeed(input: ConfigSeedInput): SysConfig {
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
    configKey: input.configKey,
    configName: input.configName,
    configSource: input.configSource ?? 'config_source_custom',
    configType: input.configType ?? null,
    configValue: input.configValue ?? null,
    sourceRemark: input.sourceRemark ?? null,
  }
}

const sysConfigSeeds: SysConfig[] = [
  createConfigSeed({
    id: 'cfg-1',
    code: 'site_name',
    configKey: 'site.name',
    configName: '站点名称',
    configSource: 'config_source_system',
    configType: 'system',
    configValue: 'Antdv Next Admin',
    sourceRemark: '系统默认站点名称',
  }),
  createConfigSeed({
    id: 'cfg-2',
    code: 'login_captcha',
    configKey: 'login.captcha',
    configName: '登录验证码',
    configSource: 'config_source_custom',
    configType: 'security',
    configValue: 'enabled',
    sourceRemark: '控制登录页验证码开关',
  }),
  createConfigSeed({
    id: 'cfg-3',
    code: 'theme_mode',
    configKey: 'theme.mode',
    configName: '主题模式',
    configSource: 'config_source_custom',
    configType: 'ui',
    configValue: 'light',
    sourceRemark: '后台默认主题模式',
  }),
]

export function cloneSysConfigSeeds() {
  return sysConfigSeeds.map(item => ({
    ...item,
    createTime: item.createTime ? new Date(item.createTime) : null,
    updateTime: item.updateTime ? new Date(item.updateTime) : null,
  }))
}
