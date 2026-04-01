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
    collapsed: false,
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
})
