<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({ name: 'AdminWorkspaceDashboardPage' })

definePage({
  meta: {
    title: '控制台',
  },
})

const dashboardSummary = [
  { label: '待发布配置', value: '6 项' },
  { label: '异常告警', value: '2 条' },
  { label: '今日新增用户', value: '126' },
] as const

const quickEntries = [
  {
    title: '菜单管理',
    description: '维护后台路由、权限按钮与展示结构',
    to: '/admin/system/menu',
  },
  {
    title: '用户管理',
    description: '快速查看账号状态与基础资料',
    to: '/admin/system/user',
  },
  {
    title: '角色管理',
    description: '调整角色状态与基础权限范围',
    to: '/admin/system/role',
  },
  {
    title: '配置管理',
    description: '维护业务开关和运行时配置项',
    to: '/admin/system/config',
  },
] as const

const serverStates = [
  {
    label: 'API 响应时间',
    value: '124 ms',
    state: '稳定',
    color: 'success',
    accent: 'border-success-border',
  },
  {
    label: '任务队列',
    value: '28 条',
    state: '处理中',
    color: 'processing',
    accent: 'border-info-border',
  },
  {
    label: '错误告警',
    value: '2 条',
    state: '需关注',
    color: 'warning',
    accent: 'border-warning-border',
  },
  {
    label: 'CPU 使用率',
    value: '43%',
    state: '正常',
    color: 'success',
    accent: 'border-border-sec',
  },
] as const

const projectProgress = [
  {
    title: '商城改版',
    percent: 84,
    owner: '产品体验组',
    accent: 'bg-primary',
  },
  {
    title: '渠道投放看板',
    percent: 67,
    owner: '数据运营组',
    accent: 'bg-info',
  },
  {
    title: '会员权益升级',
    percent: 52,
    owner: '增长业务组',
    accent: 'bg-warning',
  },
  {
    title: '客服工单归档',
    percent: 91,
    owner: '交付支持组',
    accent: 'bg-success',
  },
] as const

const salesRanking = [
  { name: '华东一区', amount: '¥ 438,000', ratio: '32%' },
  { name: '直营电商', amount: '¥ 362,000', ratio: '27%' },
  { name: '渠道分销', amount: '¥ 286,000', ratio: '21%' },
  { name: '华南区域', amount: '¥ 241,000', ratio: '18%' },
] as const

const operationLogs = [
  { title: '系统配置已更新', detail: '登录验证码调整为按环境启用', time: '今天 09:24' },
  { title: '新增角色“数据审阅员”', detail: '同步开放报表只读权限', time: '今天 10:06' },
  { title: '用户批量导入完成', detail: '共导入 26 条账号记录', time: '今天 10:40' },
  { title: '菜单结构发布成功', detail: '工作台子菜单已刷新到最新版本', time: '今天 11:15' },
] as const
</script>

<template>
  <page-container>
    <div class="space-y-5 p-5">
      <section class="rounded-3xl border border-border bg-container px-6 py-6 shadow-card">
        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
          <div class="space-y-3">
            <div class="text-sm text-text-secondary">Console</div>
            <div class="text-2xl font-semibold text-text">控制台总览</div>
            <p class="max-w-3xl text-sm leading-6 text-text-secondary">
              这里聚合了当前系统的核心状态、快捷入口和项目推进情况。整体以轻量信息面板为主，方便快速浏览和进入具体模块。
            </p>
          </div>
          <div class="grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
            <div
              v-for="item in dashboardSummary"
              :key="item.label"
              class="rounded-2xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="text-xs text-text-tertiary">{{ item.label }}</div>
              <div class="mt-2 text-xl font-semibold text-text">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in serverStates"
          :key="item.label"
          class="rounded-3xl border bg-container px-5 py-5 shadow-card"
          :class="item.accent"
        >
          <div class="text-sm text-text-secondary">{{ item.label }}</div>
          <div class="mt-3 flex items-end justify-between gap-3">
            <div class="text-3xl font-semibold text-text">{{ item.value }}</div>
            <a-tag :color="item.color">{{ item.state }}</a-tag>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <a-card :bordered="false" class="rounded-3xl shadow-card" title="项目进度">
          <div class="space-y-4">
            <div
              v-for="item in projectProgress"
              :key="item.title"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-medium text-text">{{ item.title }}</div>
                  <div class="mt-1 text-sm text-text-secondary">{{ item.owner }}</div>
                </div>
                <div class="text-sm font-medium text-text">{{ item.percent }}%</div>
              </div>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div
                  class="h-full rounded-full"
                  :class="item.accent"
                  :style="{ width: `${item.percent}%` }"
                />
              </div>
            </div>
          </div>
        </a-card>

        <a-card :bordered="false" class="rounded-3xl shadow-card" title="快捷入口">
          <div class="grid gap-3">
            <RouterLink
              v-for="item in quickEntries"
              :key="item.to"
              :to="item.to"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4 text-text transition hover:border-primary/40 hover:bg-primary/4"
            >
              <div class="font-medium">{{ item.title }}</div>
              <div class="mt-1 text-sm leading-6 text-text-secondary">{{ item.description }}</div>
            </RouterLink>
          </div>
        </a-card>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <a-card :bordered="false" class="rounded-3xl shadow-card" title="销售排行">
          <div class="space-y-3">
            <div
              v-for="(item, index) in salesRanking"
              :key="item.name"
              class="flex items-center justify-between rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <div class="font-medium text-text">{{ item.name }}</div>
                  <div class="mt-1 text-xs text-text-tertiary">销售占比 {{ item.ratio }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-text">{{ item.amount }}</div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card :bordered="false" class="rounded-3xl shadow-card" title="最近操作">
          <div class="space-y-3">
            <div
              v-for="item in operationLogs"
              :key="item.title"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-text">{{ item.title }}</div>
                  <div class="mt-1 text-sm leading-6 text-text-secondary">{{ item.detail }}</div>
                </div>
                <div class="whitespace-nowrap text-xs text-text-tertiary">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </section>
    </div>
  </page-container>
</template>
