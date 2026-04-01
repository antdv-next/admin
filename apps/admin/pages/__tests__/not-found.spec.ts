import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import NotFoundPage from '../[...path].vue'

const back = vi.fn()
const push = vi.fn()

vi.stubGlobal('definePage', vi.fn())

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRouter: () => ({
      back,
      push,
    }),
  }
})

describe('AdminNotFoundPage', () => {
  beforeEach(() => {
    back.mockReset()
    push.mockReset()
    window.history.replaceState(null, '', '/admin/missing-page')
  })

  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('renders a 404 result with recovery actions', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          'a-result': {
            props: ['status', 'title', 'subTitle'],
            template: `
              <section data-test="result">
                <div data-test="status">{{ status }}</div>
                <div data-test="title">{{ title }}</div>
                <div data-test="subtitle">{{ subTitle }}</div>
                <slot name="extra" />
              </section>
            `,
          },
          'a-button': {
            emits: ['click'],
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.get('[data-test="status"]').text()).toBe('404')
    expect(wrapper.get('[data-test="title"]').text()).toBe('页面不存在')
    expect(wrapper.get('[data-test="subtitle"]').text()).toContain('管理后台')
    expect(wrapper.text()).toContain('返回上一页')
    expect(wrapper.text()).toContain('回到工作台')
  })

  it('goes back when there is router history state', async () => {
    window.history.replaceState({ back: '/admin/workspace/overview' }, '', '/admin/missing-page')

    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          'a-result': {
            template: '<section><slot name="extra" /></section>',
          },
          'a-button': {
            emits: ['click'],
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.get('button').trigger('click')

    expect(back).toHaveBeenCalledTimes(1)
    expect(push).not.toHaveBeenCalled()
  })

  it('falls back to the workspace overview when no router history state exists', async () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          'a-result': {
            template: '<section><slot name="extra" /></section>',
          },
          'a-button': {
            emits: ['click'],
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    await wrapper.get('button').trigger('click')

    expect(back).not.toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/admin/workspace/overview')
  })
})
