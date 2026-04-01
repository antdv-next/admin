<script setup lang="ts">
defineOptions({
  name: 'DefaultLayoutPageSkeleton',
})
</script>

<template>
  <div class="min-h-full p-5">
    <div class="mx-auto flex max-w-350 flex-col gap-5">
      <a-card :bordered="false">
        <div class="flex flex-col gap-4">
          <a-skeleton-button active block size="large" style="width: 220px" />
          <div class="grid gap-4 md:grid-cols-3">
            <a-skeleton-button
              v-for="index in 3"
              :key="index"
              active
              block
              size="large"
              style="width: 100%; height: 88px"
            />
          </div>
        </div>
      </a-card>

      <a-card :bordered="false">
        <div class="flex flex-col gap-3">
          <a-skeleton-button active size="default" style="width: 160px" />
          <a-skeleton
            active
            :paragraph="{
              rows: 8,
            }"
          />
        </div>
      </a-card>
    </div>
  </div>
</template>
