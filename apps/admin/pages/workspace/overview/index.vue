<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'AdminWorkspaceOverviewPage' })

definePage({
  meta: {
    title: '概览',
  },
})

const userStore = useUserStore()

const displayName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '管理员',
)

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) {
    return '上午好'
  }
  if (hour < 18) {
    return '下午好'
  }
  return '晚上好'
})

const overviewStats = [
  {
    key: 'sales',
    label: '本月销售额',
    value: '¥ 286,430',
    trend: '+18.6%',
    accent: 'border-primary',
    tone: 'text-primary',
  },
  {
    key: 'orders',
    label: '新增订单',
    value: '1,248',
    trend: '+9.2%',
    accent: 'border-info-border',
    tone: 'text-info',
  },
  {
    key: 'users',
    label: '活跃用户',
    value: '8,932',
    trend: '+12.4%',
    accent: 'border-success-border',
    tone: 'text-success',
  },
  {
    key: 'conversion',
    label: '支付转化率',
    value: '63.8%',
    trend: '+3.1%',
    accent: 'border-warning-border',
    tone: 'text-warning',
  },
] as const

const summaryBadges = [
  { label: '今日目标完成率', value: '78%' },
  { label: '待办事项', value: '9 项' },
  { label: '风险提醒', value: '2 条' },
] as const

const todoItems = [
  {
    title: '审核 12 条客户折扣申请',
    detail: '销售一部提交，需在今天 18:00 前处理',
    tag: '待处理',
    color: 'processing',
  },
  {
    title: '同步 Q2 商品价格表',
    detail: '已完成财务确认，等待运营发布',
    tag: '进行中',
    color: 'warning',
  },
  {
    title: '复核华东区域库存预警',
    detail: '缺货 SKU 7 个，建议补货优先级提升',
    tag: '重点',
    color: 'error',
  },
] as const

const businessMetrics = [
  {
    label: '渠道成交额',
    value: '¥ 92,340',
    detail: '较昨日 +6.8%',
    width: '72%',
    tone: 'bg-primary',
  },
  {
    label: '复购订单占比',
    value: '41.5%',
    detail: '高价值用户贡献稳定',
    width: '58%',
    tone: 'bg-info',
  },
  {
    label: '客服响应达标率',
    value: '96.2%',
    detail: '峰值时段仍保持稳定',
    width: '84%',
    tone: 'bg-success',
  },
] as const

const activityItems = [
  {
    title: '销售大屏已更新到最新日报',
    detail: '经营日报已同步给销售和运营负责人。',
    time: '10 分钟前',
  },
  {
    title: '王珂 完成了 4 月返利配置调整',
    detail: '返利区间和渠道折扣策略已进入待生效状态。',
    time: '32 分钟前',
  },
  {
    title: '系统自动归档 126 条历史工单',
    detail: '历史工单已归档至近三个月查询视图。',
    time: '1 小时前',
  },
  {
    title: '渠道运营新建了“618 预热”专题活动',
    detail: '活动素材和优惠策略已提交审核。',
    time: '2 小时前',
  },
] as const

const weeklyFocus = [
  {
    title: '补齐会员活动页面埋点',
    owner: '数据运营组',
  },
  {
    title: '复盘重点区域转化漏斗',
    owner: '增长业务组',
  },
  {
    title: '整理 4 月异常退款案例',
    owner: '交付支持组',
  },
] as const
</script>

<template>
  <page-container>
    <div class="space-y-5 p-5">
      <section class="rounded-3xl border border-border bg-container px-6 py-6 shadow-card">
        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <a-avatar :size="48" class="bg-primary-bg text-primary">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <div>
                <div class="text-sm text-text-secondary">Workspace Overview</div>
                <div class="text-2xl font-semibold text-text">
                  {{ greetingText }}，{{ displayName }}
                </div>
              </div>
            </div>
            <div class="max-w-3xl space-y-2">
              <div class="text-lg font-medium text-text">今天的经营节奏已经准备就绪</div>
              <p class="text-sm leading-6 text-text-secondary">
                销售、订单和客服数据都已同步完成。当前更适合先处理审批类待办，再跟进重点活动与渠道表现。
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="item in summaryBadges"
                :key="item.label"
                class="rounded-2xl border border-border-sec bg-base px-4 py-3"
              >
                <div class="text-xs text-text-tertiary">{{ item.label }}</div>
                <div class="mt-1 text-lg font-semibold text-text">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-border-sec bg-base px-5 py-5">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-text">今日摘要</div>
                <div class="mt-1 text-xs text-text-tertiary">截至 11:30 自动汇总</div>
              </div>
              <a-tag color="processing">稳定运行</a-tag>
            </div>
            <div class="mt-5 grid gap-4">
              <div class="rounded-2xl bg-container px-4 py-4">
                <div class="text-xs text-text-tertiary">重点关注</div>
                <div class="mt-2 text-base font-medium text-text">审批事项与库存预警需优先处理</div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-container px-4 py-4">
                  <div class="text-xs text-text-tertiary">新增客户</div>
                  <div class="mt-2 text-xl font-semibold text-text">126</div>
                </div>
                <div class="rounded-2xl bg-container px-4 py-4">
                  <div class="text-xs text-text-tertiary">退款率</div>
                  <div class="mt-2 text-xl font-semibold text-text">1.8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in overviewStats"
          :key="item.key"
          class="rounded-3xl border bg-container px-5 py-5 shadow-card"
          :class="item.accent"
        >
          <div class="text-sm text-text-secondary">{{ item.label }}</div>
          <div class="mt-3 flex items-end justify-between gap-4">
            <div class="text-3xl font-semibold text-text">{{ item.value }}</div>
            <div class="rounded-full px-2.5 py-1 text-xs font-medium bg-base" :class="item.tone">
              {{ item.trend }}
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <a-card :bordered="false" class="rounded-3xl shadow-card">
          <template #title>
            <div class="flex items-center justify-between">
              <span>经营摘要</span>
              <span class="text-xs font-normal text-text-tertiary">今日核心数据</span>
            </div>
          </template>

          <div class="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div class="rounded-3xl border border-border-sec bg-base px-5 py-5">
              <div class="text-sm text-text-secondary">累计回款</div>
              <div class="mt-2 text-3xl font-semibold text-text">¥ 1,287,000</div>
              <div class="mt-3 text-sm leading-6 text-text-secondary">
                环比上月增长 14.8%，核心增长仍然来自续费与渠道复购。
              </div>
              <div class="mt-5 rounded-2xl bg-container px-4 py-4">
                <div class="text-xs text-text-tertiary">预计本周完成进度</div>
                <div class="mt-2 text-xl font-semibold text-text">86%</div>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in businessMetrics"
                :key="item.label"
                class="rounded-3xl border border-border-sec bg-base px-5 py-5"
              >
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-sm font-medium text-text">{{ item.label }}</div>
                    <div class="mt-1 text-xs text-text-tertiary">{{ item.detail }}</div>
                  </div>
                  <div class="text-xl font-semibold text-text">{{ item.value }}</div>
                </div>
                <div class="mt-4 h-2 overflow-hidden rounded-full bg-border">
                  <div
                    class="h-full rounded-full"
                    :class="item.tone"
                    :style="{ width: item.width }"
                  />
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card :bordered="false" class="rounded-3xl shadow-card" title="待办事项">
          <div class="space-y-3">
            <div
              v-for="item in todoItems"
              :key="item.title"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-medium text-text">{{ item.title }}</div>
                  <div class="mt-1 text-sm leading-6 text-text-secondary">{{ item.detail }}</div>
                </div>
                <a-tag :color="item.color">{{ item.tag }}</a-tag>
              </div>
            </div>
          </div>
        </a-card>
      </section>

      <section class="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <a-card :bordered="false" class="rounded-3xl shadow-card" title="最新动态">
          <div class="space-y-3">
            <div
              v-for="item in activityItems"
              :key="item.title"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-start gap-3">
                <div class="mt-2 h-2 w-2 rounded-full bg-primary" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-3">
                    <div class="font-medium text-text">{{ item.title }}</div>
                    <div class="whitespace-nowrap text-xs text-text-tertiary">{{ item.time }}</div>
                  </div>
                  <div class="mt-1 text-sm leading-6 text-text-secondary">{{ item.detail }}</div>
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card :bordered="false" class="rounded-3xl shadow-card" title="本周重点">
          <div class="space-y-3">
            <div
              v-for="item in weeklyFocus"
              :key="item.title"
              class="rounded-3xl border border-border-sec bg-base px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-medium text-text">{{ item.title }}</div>
                  <div class="mt-1 text-sm text-text-secondary">{{ item.owner }}</div>
                </div>
                <a-tag color="default">跟进中</a-tag>
              </div>
            </div>
          </div>
        </a-card>
      </section>
    </div>
  </page-container>
</template>
