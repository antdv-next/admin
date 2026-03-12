<script setup lang="ts">
import type { FormProps } from 'antdv-next'
import { LockOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@antdv-next/icons'
import { useDarkMode } from '@/composables/dark'

defineOptions({ name: 'LoginPage' })

definePage({
  meta: {
    layout: false,
    title: '登录',
  },
})

const { isDark, toggleDark } = useDarkMode()

const formModel = reactive({
  username: '',
  password: '',
  remember: true,
})

const formRules: FormProps['rules'] = {
  username: [
    { required: true, message: '请输入账号' },
    { min: 3, message: '账号至少 3 个字符' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 5, message: '密码至少 5 个字符' },
  ],
}

const loading = ref(false)

async function handleFinish(_values: any) {
  console.log(_values)
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-layout p-6 text-text font-sans isolate"
  >
    <!-- Background glow -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        class="absolute left-1/4 top-1/4 h-125 w-125 rounded-full bg-primary/15 blur-[150px]"
      />
      <div
        class="absolute bottom-1/4 right-1/4 h-100 w-100 rounded-full bg-info/10 blur-[150px]"
      />
    </div>

    <!-- Login Card -->
    <div
      class="relative w-full max-w-md rounded-3xl border border-border bg-elevated/30 p-10 backdrop-blur-xl"
    >
      <!-- Dark Mode Toggle -->
      <button
        class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-text-tertiary transition hover:bg-base hover:text-text"
        @click="toggleDark()"
      >
        <MoonOutlined v-if="!isDark" class="text-lg" />
        <SunOutlined v-else class="text-lg" />
      </button>

      <!-- Header -->
      <div class="mb-10 text-center">
        <img src="/antdv-next.svg" alt="Antdv Next" class="mx-auto mb-4 h-12 w-12">
        <h2 class="text-2xl font-bold tracking-tight">
          欢迎回来
        </h2>
        <p class="mt-2 text-sm text-text-secondary">
          Hi, 欢迎登录 Antdv Next 管理后台
        </p>
      </div>

      <!-- Login Form -->
      <a-form
        name="login"
        :model="formModel"
        :rules="formRules"
        layout="vertical"
        @finish="handleFinish"
      >
        <a-form-item label="账号" name="username">
          <a-input
            v-model:value="formModel.username"
            placeholder="admin"
            size="large"
            :classes="{
              root: 'bg-transparent',
            }"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input
            v-model:value="formModel.password"
            size="large"
            type="password"
            placeholder="admin"
            :classes="{
              root: 'bg-transparent',
            }"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-flex justify="space-between" align="center">
            <a-form-item name="remember" no-style>
              <a-checkbox v-model:checked="formModel.remember">
                记住我
              </a-checkbox>
            </a-form-item>
            <a
              href="#"
              class="text-sm text-primary hover:text-primary-hover active:text-primary-active"
            >
              忘记密码？
            </a>
          </a-flex>
        </a-form-item>

        <a-form-item>
          <a-button
            block
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
          >
            立即登录
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Footer -->
      <div
        class="mt-8 border-t border-border pt-8 text-center text-sm text-text-tertiary"
      >
        还没有账号？
        <a
          href="#"
          class="font-semibold text-primary hover:text-primary-hover active:text-primary-active hover:underline"
        >
          立即注册
        </a>
      </div>
    </div>
  </div>
</template>
