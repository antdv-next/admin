<script setup lang="ts">
import { useDarkMode } from '@/composables/dark';

defineOptions({ name: 'LayoutFooter' });

const { isDark } = useDarkMode();

const currentYear = new Date().getFullYear();

const footerLinks = [
  { label: '更新日志', href: 'https://www.antdv-next.com/components/changelog' },
  { label: '赞助项目', href: 'https://www.antdv-next.com/sponsor' },
  { label: '贡献指南', href: 'https://www.antdv-next.com/docs/vue/contributing' },
];

const isExternalLink = (href: string) => /^https?:\/\//.test(href);
</script>

<template>
  <footer class="border-t py-12" :class="isDark ? 'border-white/10' : 'border-gray-200'">
    <div
      class="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 md:flex-row"
    >
      <div class="text-sm italic" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        &copy; {{ currentYear }} Antdv Next Team. 基于 MIT 协议开源。
      </div>
      <div class="flex gap-6">
        <a
          v-for="link in footerLinks"
          :key="link.label"
          :href="link.href"
          :target="isExternalLink(link.href) ? '_blank' : undefined"
          :rel="isExternalLink(link.href) ? 'noopener noreferrer' : undefined"
          class="transition"
          :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </footer>
</template>
