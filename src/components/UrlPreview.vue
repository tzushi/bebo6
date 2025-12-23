<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { fetchUrlMetadata } from '../services/urlMetadata'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const settingsStore = useSettingsStore()
const metadata = ref(null)
const loading = ref(true)
const showPreview = ref(true)
const retryCount = ref(0)
const maxRetries = 2

const fetchMetadata = async () => {
  try {
    const data = await fetchUrlMetadata(props.url)
    if (data) {
      metadata.value = data
    } else {
      if (retryCount.value < maxRetries) {
        retryCount.value++
        setTimeout(fetchMetadata, 2000) // Retry after 2 seconds
        return
      }
      showPreview.value = false
    }
  } catch {
    showPreview.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!settingsStore.showUrlPreviews) {
    loading.value = false
    return
  }
  fetchMetadata()
})
</script>

<template>
  <div 
    v-if="!loading && metadata && settingsStore.showUrlPreviews && showPreview" 
    class="mt-2 border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <a :href="url" target="_blank" rel="noopener noreferrer" class="block">
      <div class="flex">
        <div v-if="metadata.image" class="w-24 h-24 flex-shrink-0">
          <img
            :src="metadata.image"
            :alt="metadata.title"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="showPreview = false"
          />
        </div>
        <div class="p-3 flex-1 min-w-0">
          <h3 class="text-sm font-medium text-gray-900 truncate">
            {{ metadata.title || url }}
          </h3>
          <p v-if="metadata.description" class="mt-1 text-xs text-gray-500 line-clamp-2">
            {{ metadata.description }}
          </p>
          <p class="mt-1 text-xs text-gray-400 truncate">{{ url }}</p>
        </div>
      </div>
    </a>
  </div>
  <div 
    v-else-if="!loading && settingsStore.showUrlPreviews && !showPreview"
    class="mt-2"
  >
    <a 
      :href="url" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-primary-600 hover:text-primary-700 text-sm"
    >
      {{ url }}
    </a>
  </div>
</template>