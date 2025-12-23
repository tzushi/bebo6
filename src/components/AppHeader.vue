<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { useSearchStore } from '../stores/search'
import { useSettingsStore } from '../stores/settings'
import { useRouter, useRoute } from 'vue-router'

const store = useChatStore()
const authStore = useAuthStore()
const searchStore = useSearchStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

const isAccountPage = computed(() => ['account', 'email-change', 'password-change'].includes(route.name))

const title = computed(() => {
  if (isAccountPage.value) {
    return 'アカウントメニュー'
  }
  return store.currentChatMemoTitle || 'bebo6'
})

const handleSettingsClick = () => {
  if (isAccountPage.value) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'account' })
  }
}
</script>

<template>
  <header v-if="authStore.isAuthenticated" class="bg-white shadow-soft">
    <div class="h-14 flex items-center px-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="text-gray-500 hover:text-gray-700 lg:hidden btn-hover-effect p-2 rounded-lg"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h1 class="text-xl font-bold text-gray-900 ml-4 truncate">{{ title }}</h1>
      </div>
      <!-- Search button -->
      <button
        v-if="route.name === 'memo'"
        @click="searchStore.toggleSearch"
        class="ml-2 text-gray-500 hover:text-gray-700 btn-hover-effect p-2 rounded-lg"
        :class="{ 'text-primary-500': searchStore.showSearch }"
        title="検索"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <!-- Details button -->
      <button
        v-if="route.name === 'memo'"
        @click="settingsStore.toggleDetails"
        class="ml-2 text-gray-500 hover:text-gray-700 btn-hover-effect p-2 rounded-lg"
        :class="{ 'text-primary-500': settingsStore.showDetails }"
        title="詳細表示"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <!-- Account button -->
      <button
        @click="handleSettingsClick"
        class="ml-2 text-gray-500 hover:text-primary-500 btn-hover-effect p-2 rounded-lg"
        :title="isAccountPage ? '戻る' : 'アカウントメニュー'"
      >
        <svg v-if="!isAccountPage" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
    </div>
  </header>
</template>