<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  show: Boolean,
  isSignup: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const deferredPrompt = ref(null)
const isIOSDevice = ref(false)

onMounted(() => {
  // Check if it's an iOS device
  isIOSDevice.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const installPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null
    emit('close')
  }
}

const handleClose = () => {
  // Store that user has seen the prompt
  if (!props.isSignup) {
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  {{ isSignup ? 'ホーム画面に追加しませんか？' : 'より快適に使えます' }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ isSignup ? 'bebo6をホーム画面に追加して、より快適にご利用いただけます。' : 'ホーム画面に追加すると、アプリのように使えて便利です。' }}
                  </p>
                  <div v-if="isIOSDevice" class="mt-4 space-y-2 text-sm text-gray-500">
                    <p>iOSデバイスでの追加方法:</p>
                    <ol class="list-decimal pl-5">
                      <li>Safariの共有ボタン（□↑）をタップ</li>
                      <li>「ホーム画面に追加」を選択</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              v-if="!isIOSDevice && deferredPrompt"
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              @click="installPWA"
            >
              インストール
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="handleClose"
            >
              {{ isIOSDevice ? '閉じる' : '後で' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>