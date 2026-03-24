<template>
  <div class="w-full selection:bg-primary/30">
    <!-- Hero Section -->
    <section class="relative isolate overflow-hidden pb-20 pt-16 lg:pb-32 lg:pt-32">
      <!-- Background glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-150 w-250 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />

      <div class="mx-auto max-w-7xl px-6 text-center">
        <!-- Badge -->
        <div
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-bg px-3 py-1 text-xs font-semibold text-primary"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
            />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          v1.0.0 已于 2月3日 发布
        </div>

        <!-- Headline -->
        <h1 class="mb-8 text-5xl font-extrabold leading-tight lg:text-7xl">
          为
          <span class="bg-linear-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Vue 3
          </span>
          而生的
          <br />
          企业级 UI 解决方案
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary lg:text-xl">
          基于 Ant Design 设计规范，利用 Vue 3 组合式 API 与 TypeScript
          重构。更轻量、更快速、更易扩展。
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
            class="w-full rounded-xl border border-border bg-container px-8 py-4 text-lg font-bold text-text transition hover:bg-base sm:w-auto"
          >
            在线演示
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-base/80 py-20">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Feature 1 -->
          <div
            class="group rounded-2xl border border-border bg-container p-8 transition hover:border-primary/30 hover:shadow-card"
          >
            <div
              class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition group-hover:scale-110"
            >
              <svg
                class="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">卓越性能</h3>
            <p class="leading-relaxed text-text-secondary">
              彻底拥抱 Vue 3.5+ 特性，优化计算属性与虚拟 DOM 渲染，大型表格不卡顿。
            </p>
          </div>

          <!-- Feature 2 -->
          <div
            class="group rounded-2xl border border-border bg-container p-8 transition hover:border-primary/30 hover:shadow-card"
          >
            <div
              class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition group-hover:scale-110"
            >
              <svg
                class="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">TypeScript 原生支持</h3>
            <p class="leading-relaxed text-text-secondary">
              完善的类型定义，支持 TSX 开发，提供极致的 IDE 开发补全体验。
            </p>
          </div>

          <!-- Feature 3 -->
          <div
            class="group rounded-2xl border border-border bg-container p-8 transition hover:border-primary/30 hover:shadow-card"
          >
            <div
              class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition group-hover:scale-110"
            >
              <svg
                class="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 class="mb-4 text-xl font-bold">Ant Design 风格</h3>
            <p class="leading-relaxed text-text-secondary">
              延续经典的 UI 设计语言，高度一致的视觉反馈，无缝迁移现有业务。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Example Section -->
    <section class="py-20">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="mb-12 text-3xl font-bold">声明式，更简单</h2>
        <div class="overflow-hidden rounded-2xl border border-border shadow-card">
          <!-- Code editor top bar -->
          <div class="flex items-center gap-2 border-b border-border bg-base p-4">
            <div class="h-3 w-3 rounded-full bg-red-500" />
            <div class="h-3 w-3 rounded-full bg-yellow-500" />
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span class="ml-2 text-xs text-text-tertiary">App.vue</span>
          </div>
          <!-- Code content -->
          <div class="overflow-x-auto bg-container p-8 text-left font-mono text-sm">
            <pre><span class="text-primary">&lt;template&gt;</span>
  <span class="text-text-tertiary">&lt;!-- 像使用 Ant Design 一样简单 --&gt;</span>
  <span class="text-info">&lt;a-button</span> <span class="text-warning">type</span>=<span class="text-success">"primary"</span> <span class="text-info">@click</span>=<span class="text-success">"handleClick"</span><span class="text-info">&gt;</span>
    Hello Antdv Next
  <span class="text-info">&lt;/a-button&gt;</span>
<span class="text-primary">&lt;/template&gt;</span>

<span class="text-primary">&lt;script</span> <span class="text-warning">setup</span><span class="text-primary">&gt;</span>
<span class="text-primary">const</span> <span class="text-warning">handleClick</span> = () <span class="text-primary">=&gt;</span> {
  <span class="text-warning">console</span>.<span class="text-warning">log</span>(<span class="text-success">'Button clicked!'</span>);
};
<span class="text-primary">&lt;/script&gt;</span></pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
