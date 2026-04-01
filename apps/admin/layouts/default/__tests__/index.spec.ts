import { defineComponent, h, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import DefaultLayout from '../index.vue'

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  return { promise, resolve, reject }
}

vi.mock('antdv-next', () => {
  const PassThroughStub = defineComponent({
    name: 'AntdvNextStub',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  })

  return new Proxy(
    {
      __esModule: true,
      ConfigProvider: {
        config: vi.fn(),
      },
    },
    {
      get(target, prop) {
        if (prop in target) {
          return target[prop as keyof typeof target]
        }

        return PassThroughStub
      },
    },
  )
})

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    collapsed: shallowRef(false),
    toggleCollapsed: vi.fn(),
  }),
}))

vi.mock('@/composables/dark', () => ({
  useDarkMode: () => ({
    isDark: shallowRef(false),
  }),
}))

vi.mock('@/composables/token', () => ({
  useGlobalToken: () => ({
    token: shallowRef({
      colorBgContainer: '#fff',
    }),
  }),
}))

describe('DefaultLayout', () => {
  it('shows fallback content while the routed page is suspended', async () => {
    const deferred = createDeferred<void>()
    const AsyncPage = defineComponent({
      name: 'AsyncPage',
      async setup() {
        await deferred.promise
        return () => h('div', { 'data-test': 'async-page' }, 'Async page ready')
      },
    })

    const RouterViewStub = defineComponent({
      name: 'RouterViewStub',
      setup(_, { slots }) {
        return () => {
          if (slots.default) {
            return slots.default({
              Component: AsyncPage,
              route: {
                fullPath: '/admin/async-page',
              },
            })
          }

          return h(AsyncPage)
        }
      },
    })

    const PassThroughStub = defineComponent({
      name: 'PassThroughStub',
      setup(_, { slots }) {
        return () => h('div', slots.default?.())
      },
    })

    const wrapper = mount(DefaultLayout, {
      global: {
        stubs: {
          PageSkeleton: {
            template: '<div data-test="page-skeleton">Loading page</div>',
          },
          DefaultHeader: true,
          DefaultSider: true,
          RouterView: RouterViewStub,
          'router-view': RouterViewStub,
          AConfigProvider: PassThroughStub,
          ALayout: PassThroughStub,
          ALayoutHeader: PassThroughStub,
          ALayoutSider: PassThroughStub,
          ALayoutContent: PassThroughStub,
          'a-config-provider': PassThroughStub,
          'a-layout': PassThroughStub,
          'a-layout-header': PassThroughStub,
          'a-layout-sider': PassThroughStub,
          'a-layout-content': PassThroughStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('[data-test="page-skeleton"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="async-page"]').exists()).toBe(false)

    deferred.resolve()
    await flushPromises()

    expect(wrapper.find('[data-test="page-skeleton"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="async-page"]').text()).toBe('Async page ready')
  })

  it('renders a fixed header and fixed sider shell with content offsets', () => {
    const RouterViewStub = defineComponent({
      name: 'RouterViewStub',
      setup(_, { slots }) {
        return () =>
          slots.default?.({
            Component: defineComponent({
              name: 'SyncPage',
              setup() {
                return () => h('div', { 'data-test': 'sync-page' }, 'Sync page')
              },
            }),
            route: {
              fullPath: '/admin/workspace/overview',
            },
          })
      },
    })

    const PassThroughStub = defineComponent({
      name: 'PassThroughStub',
      inheritAttrs: false,
      setup(_, { attrs, slots }) {
        return () => h('div', attrs, slots.default?.())
      },
    })

    const wrapper = mount(DefaultLayout, {
      global: {
        stubs: {
          DefaultHeader: {
            template: '<div data-test="default-header-stub">Header</div>',
          },
          DefaultSider: {
            template: '<div data-test="default-sider-stub">Sider</div>',
          },
          RouterView: RouterViewStub,
          'router-view': RouterViewStub,
          AConfigProvider: PassThroughStub,
          ALayout: PassThroughStub,
          ALayoutHeader: PassThroughStub,
          ALayoutSider: PassThroughStub,
          ALayoutContent: PassThroughStub,
          'a-config-provider': PassThroughStub,
          'a-layout': PassThroughStub,
          'a-layout-header': PassThroughStub,
          'a-layout-sider': PassThroughStub,
          'a-layout-content': PassThroughStub,
        },
      },
    })

    const fixedHeader = wrapper.get('[data-test="admin-fixed-header"]')
    const fixedSider = wrapper.get('[data-test="admin-fixed-sider"]')
    const siderSpacer = wrapper.get('[data-test="admin-sider-header-spacer"]')
    const siderBody = wrapper.get('[data-test="admin-sider-scroll-body"]')
    const content = wrapper.get('[data-test="admin-layout-content"]')

    expect(fixedHeader.classes()).toContain('fixed')
    expect(fixedHeader.classes()).toContain('top-0')
    expect(fixedSider.classes()).toContain('fixed')
    expect(fixedSider.classes()).toContain('inset-y-0')
    expect(fixedSider.classes()).toContain('antdv-admin-sider')
    expect(content.classes()).toContain('pt-14')
    expect(fixedHeader.attributes('style')).toContain('z-index: 50')
    expect(fixedSider.attributes('style')).toContain('z-index: 40')
    expect(content.attributes('style')).toContain('margin-left: 245px')
    expect(fixedSider.attributes('style')).toContain('width: 245px')
    expect(siderSpacer.classes()).toContain('h-14')
    expect(siderBody.attributes('style')).toContain('height: calc(100vh - 56px)')
  })
})
