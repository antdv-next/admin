<script setup lang="ts">
import { useDarkMode } from '@/composables/dark'

const { isDark } = useDarkMode()
</script>

<template>
  <div class="w-full selection:bg-blue-500/30">
    <!-- Hero Section -->
    <section class="relative isolate overflow-hidden pb-20 pt-16 lg:pb-32 lg:pt-32">
      <!-- Background glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-150 w-250 -translate-x-1/2 rounded-full blur-[120px]"
        :class="isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'"
      />

      <div class="mx-auto max-w-7xl px-6 text-center">
        <!-- Badge -->
        <div
          class="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
          :class="isDark ? 'border-blue-500/30 bg-blue-500/5 text-blue-400' : 'border-blue-500/30 bg-blue-50 text-blue-600'"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          v1.0.0 已于 2月3日 发布
        </div>

        <!-- Headline -->
        <h1 class="mb-8 text-5xl font-extrabold leading-tight lg:text-7xl">
          为
          <span class="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Vue 3
          </span>
          而生的
          <br>
          企业级 UI 解决方案
        </h1>

        <!-- Subtitle -->
        <p
          class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed lg:text-xl"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
          基于 Ant Design 设计规范，利用 Vue 3 组合式 API 与 TypeScript 重构。更轻量、更快速、更易扩展。
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            class="w-full rounded-xl px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 sm:w-auto"
            style="background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%)"
          >
            快速开始
          </a>
          <a
            href="#"
            class="w-full rounded-xl border px-8 py-4 text-lg font-bold transition sm:w-auto"
            :class="isDark
              ? 'border-white/10 bg-white/3 text-white backdrop-blur-sm hover:bg-white/5'
              : 'border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100'"
          >
            在线演示
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20" :class="isDark ? 'bg-white/2' : 'bg-gray-50/80'">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Feature 1 -->
          <div
            class="group rounded-2xl border p-8 transition"
            :class="isDark
              ? 'border-white/10 bg-white/3 backdrop-blur-sm hover:border-blue-500/50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'"
          >
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 transition group-hover:scale-110">
              <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">
              卓越性能
            </h3>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="leading-relaxed">
              彻底拥抱 Vue 3.5+ 特性，优化计算属性与虚拟 DOM 渲染，大型表格不卡顿。
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            class="group rounded-2xl border p-8 transition"
            :class="isDark
              ? 'border-white/10 bg-white/3 backdrop-blur-sm hover:border-blue-500/50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'"
          >
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 transition group-hover:scale-110">
              <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">
              TypeScript 原生支持
            </h3>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="leading-relaxed">
              完善的类型定义，支持 TSX 开发，提供极致的 IDE 开发补全体验。
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            class="group rounded-2xl border p-8 transition"
            :class="isDark
              ? 'border-white/10 bg-white/3 backdrop-blur-sm hover:border-blue-500/50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'"
          >
            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 transition group-hover:scale-110">
              <svg class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">
              Ant Design 风格
            </h3>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="leading-relaxed">
              延续经典的 UI 设计语言，高度一致的视觉反馈，无缝迁移现有业务。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example Section -->
    <section class="py-20">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="mb-12 text-3xl font-bold">
          声明式，更简单
        </h2>
        <div
          class="overflow-hidden rounded-2xl border shadow-2xl"
          :class="isDark ? 'border-white/10 shadow-blue-500/10' : 'border-gray-200 shadow-blue-500/5'"
        >
          <!-- Code editor top bar -->
          <div
            class="flex items-center gap-2 border-b p-4"
            :class="isDark ? 'border-white/5 bg-[#1e1e1e]' : 'border-gray-200 bg-gray-100'"
          >
            <div class="h-3 w-3 rounded-full bg-red-500" />
            <div class="h-3 w-3 rounded-full bg-yellow-500" />
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span class="ml-2 text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">App.vue</span>
          </div>
          <!-- Code content -->
          <div
            class="overflow-x-auto p-8 text-left font-mono text-sm"
            :class="isDark ? 'bg-[#0d0d0d]' : 'bg-gray-50'"
          >
            <pre><span class="text-blue-400">&lt;template&gt;</span>
  <span :class="isDark ? 'text-gray-500' : 'text-gray-400'">&lt;!-- 像使用 Ant Design 一样简单 --&gt;</span>
  <span class="text-cyan-400">&lt;a-button</span> <span class="text-orange-300">type</span>=<span class="text-green-400">"primary"</span> <span class="text-cyan-400">@click</span>=<span class="text-green-400">"handleClick"</span><span class="text-cyan-400">&gt;</span>
    Hello Antdv Next
  <span class="text-cyan-400">&lt;/a-button&gt;</span>
<span class="text-blue-400">&lt;/template&gt;</span>

<span class="text-blue-400">&lt;script</span> <span class="text-orange-300">setup</span><span class="text-blue-400">&gt;</span>
<span class="text-purple-400">const</span> <span class="text-yellow-400">handleClick</span> = () <span class="text-purple-400">=&gt;</span> {
  <span class="text-yellow-400">console</span>.<span class="text-yellow-400">log</span>(<span class="text-green-400">'Button clicked!'</span>);
};
<span class="text-blue-400">&lt;/script&gt;</span></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
