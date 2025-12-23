<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String,
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['undo', 'timeout'])

const progress = ref(100)
const timer = ref(null)

watch(() => props.show, (newValue) => {
  if (newValue) {
    startTimer()
  } else {
    clearTimer()
  }
})

const startTimer = () => {
  clearTimer()
  progress.value = 100
  
  const startTime = Date.now()
  const tick = () => {
    const elapsed = Date.now() - startTime
    progress.value = Math.max(0, 100 * (1 - elapsed / props.duration))

    if (progress.value > 0) {
      timer.value = requestAnimationFrame(tick)
    } else {
      emit('timeout')
    }
  }

  timer.value = requestAnimationFrame(tick)
}

const clearTimer = () => {
  if (timer.value) {
    cancelAnimationFrame(timer.value)
    timer.value = null
  }
}

const handleUndo = () => {
  clearTimer()
  emit('undo')
}

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-white">{{ message }}</span>
          <button
            @click="handleUndo"
            class="ml-4 text-primary-400 hover:text-primary-300 font-medium focus:outline-none focus:underline"
          >
            元に戻す
          </button>
        </div>
      </div>
      <!-- プログレスバー -->
      <div class="h-1 w-full bg-gray-700">
        <div
          class="h-full bg-primary-500 transition-all duration-100 ease-linear"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>