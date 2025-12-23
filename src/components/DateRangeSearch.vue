<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  startDate: String,
  endDate: String
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'clear'])

const startDateInput = ref(props.startDate || '')
const endDateInput = ref(props.endDate || '')

watch(() => props.startDate, (newVal) => {
  startDateInput.value = newVal || ''
})

watch(() => props.endDate, (newVal) => {
  endDateInput.value = newVal || ''
})

const formatDateForInput = (date) => {
  if (!date) return ''
  return format(new Date(date), 'yyyy-MM-dd')
}

const handleStartDateChange = (e) => {
  const date = e.target.value
  emit('update:startDate', date ? new Date(date).toISOString() : null)
}

const handleEndDateChange = (e) => {
  const date = e.target.value
  emit('update:endDate', date ? new Date(date).toISOString() : null)
}

const clearDates = () => {
  emit('update:startDate', null)
  emit('update:endDate', null)
  emit('clear')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <input
        type="date"
        :value="formatDateForInput(startDateInput)"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        @change="handleStartDateChange"
      />
    </div>
    <span class="text-gray-500">～</span>
    <div class="flex-1">
      <input
        type="date"
        :value="formatDateForInput(endDateInput)"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        @change="handleEndDateChange"
      />
    </div>
    <button
      v-if="startDateInput || endDateInput"
      class="text-gray-400 hover:text-gray-500"
      @click="clearDates"
      title="日付をクリア"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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