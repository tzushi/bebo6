<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useMetaTags } from './composables/useMetaTags'
import { useViewportHeight } from './composables/useViewportHeight'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)
const showPWAPrompt = ref(false)

// Initialize viewport height
useViewportHeight()

// Initialize meta tags
useMetaTags()

const showSidebar = computed(() => {
  return authStore.isAuthenticated && !['login', 'signup', 'forgot-password', 'reset-password'].includes(route.name)
})

const showHeader = computed(() => {
  return authStore.isAuthenticated && !['login', 'signup', 'forgot-password', 'reset-password'].includes(route.name)
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Check if we should show PWA prompt
onMounted(() => {
  // Don't show on login/signup pages
  if (!['login', 'signup'].includes(route.name)) {
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed')
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    if (!hasSeenPrompt && !isStandalone) {
      // Delay the prompt slightly
      setTimeout(() => {
        showPWAPrompt.value = true
      }, 3000)
    }
  }
})
</script>

<template>
  <div class="app-container">
    <AppHeader
      v-if="showHeader"
      @toggle-sidebar="toggleSidebar"
      class="header"
    />

    <div class="flex-1 flex overflow-hidden relative">
      <!-- Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 top-14 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <div
        v-if="showSidebar"
        class="fixed top-14 bottom-0 left-0 w-80 bg-white z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:transform-none"
        :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen, 'lg:translate-x-0': true }"
      >
        <AppSidebar
          @select-chatmemo="closeSidebar"
        />
      </div>

      <!-- Main Content -->
      <main class="content">
        <router-view />
      </main>
    </div>
    
    <PWAInstallPrompt
      :show="showPWAPrompt"
      @close="showPWAPrompt = false"
    />
  </div>
</template>

<style>
@import './styles/layout.css';
</style>