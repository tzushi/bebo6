<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '検索...'
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])
const focused = ref(false)

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="relative flex items-center">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        class="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focused = true"
      @blur="focused = false"
    />
    <button
      v-if="modelValue"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
      @click="handleClear"
    >
      <svg
        class="h-5 w-5 text-gray-400 hover:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>