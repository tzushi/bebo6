<script setup>
import { ref, onMounted } from 'vue'
import { fetchUrlMetadata } from '../services/urlMetadata'
import { useSettingsStore } from '../stores/settings'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const settingsStore = useSettingsStore()
const metadata = ref(null)
const loading = ref(true)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 2

const fetchMetadata = async () => {
  try {
    if (!settingsStore.showUrlPreviews) {
      loading.value = false
      return
    }

    const data = await fetchUrlMetadata(props.url)
    if (data?.title) {
      metadata.value = data
      error.value = null
    } else if (retryCount.value < maxRetries) {
      retryCount.value++
      setTimeout(fetchMetadata, 2000)
    }
  } catch (e) {
    error.value = e.message
    if (retryCount.value < maxRetries) {
      retryCount.value++
      setTimeout(fetchMetadata, 2000)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMetadata()
})
</script>

<template>
  <div v-if="!loading && metadata?.title" class="mt-2 border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
    <a :href="url" target="_blank" rel="noopener noreferrer" class="block">
      <div class="flex">
        <!-- OGP Image -->
        <div v-if="metadata.image" class="w-32 h-32 flex-shrink-0">
          <img
            :src="metadata.image"
            :alt="metadata.title"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="$event.target.parentElement.style.display = 'none'"
          />
        </div>

        <!-- Content -->
        <div class="p-3 flex-1 min-w-0">
          <!-- Title -->
          <h3 class="text-sm font-medium text-gray-900 truncate">
            {{ metadata.title }}
          </h3>
          
          <!-- Description -->
          <p v-if="metadata.description" class="mt-1 text-xs text-gray-500 line-clamp-2">
            {{ metadata.description }}
          </p>
          
          <!-- URL -->
          <p class="mt-1 text-xs text-gray-400 truncate flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {{ url }}
          </p>
        </div>
      </div>
    </a>
  </div>
</template>