<script setup>
import { useSearchStore } from '../stores/search'

const searchStore = useSearchStore()

const handleHashtagClick = (hashtag) => {
  if (searchStore.selectedHashtag === hashtag) {
    searchStore.setSelectedHashtag(null)
  } else {
    searchStore.setSelectedHashtag(hashtag)
  }
}
</script>

<template>
  <div v-if="searchStore.allHashtags.length" class="p-4 border-t">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-700">ハッシュタグ</h3>
      <button
        v-if="searchStore.selectedHashtag"
        @click="searchStore.setSelectedHashtag(null)"
        class="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        クリア
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="hashtag in searchStore.allHashtags"
        :key="hashtag"
        class="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded-full transition-colors"
        :class="{ 'bg-primary-100': searchStore.selectedHashtag === hashtag }"
        @click="handleHashtagClick(hashtag)"
      >
        {{ hashtag }}
      </button>
    </div>
  </div>
</template>