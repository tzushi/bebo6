<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useSearchStore } from '../stores/search'
import { useSettingsStore } from '../stores/settings'
import { formatMessageDate } from '../utils/dateFormat'
import { isMobileDevice } from '../utils/deviceDetection'
import { extractUrls } from '../utils/urlUtils'
import { linkifyHashtags } from '../utils/hashtagUtils'
import { useAutoResize } from '../composables/useAutoResize'
import UrlMetadataDisplay from './UrlMetadataDisplay.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit-complete'])

const store = useChatStore()
const searchStore = useSearchStore()
const settingsStore = useSettingsStore()
const isEditing = ref(false)
const editedContent = ref('')
const showHistory = ref(false)
const messageHistory = ref([])
const isComposing = ref(false)
const textareaRef = ref(null)

const { adjustHeight } = useAutoResize(textareaRef)

const urls = computed(() => extractUrls(props.message.content))

const startEdit = () => {
  editedContent.value = props.message.content
  isEditing.value = true
  setTimeout(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
      adjustHeight()
    }
  })
}

const cancelEdit = () => {
  isEditing.value = false
  editedContent.value = ''
}

const saveEdit = async () => {
  if (!editedContent.value.trim()) {
    cancelEdit()
    return
  }

  if (editedContent.value !== props.message.content) {
    await store.editMessage(props.message.id, editedContent.value)
    emit('edit-complete', props.message.id)
  }
  
  isEditing.value = false
}

const deleteMessage = async () => {
  await store.deleteMessage(props.message.id)
}

const toggleHistory = async () => {
  if (!showHistory.value) {
    messageHistory.value = await store.getMessageHistory(props.message.id)
  }
  showHistory.value = !showHistory.value
}

const handleKeydown = (e) => {
  if (isMobileDevice()) return
  if (isComposing.value) return

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

const handleHashtagClick = (event) => {
  const hashtag = event.target.dataset.hashtag
  if (hashtag) {
    event.preventDefault()
    if (searchStore.selectedHashtag === `#${hashtag}`) {
      searchStore.setSelectedHashtag(null)
    } else {
      searchStore.setSelectedHashtag(`#${hashtag}`)
    }
  }
}

const formattedContent = computed(() => {
  let content = props.message.content
  content = content.replace(
    /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700">$1</a>'
  )
  return linkifyHashtags(content)
})
</script>

<template>
  <div class="message animate-slide-in" :data-message-id="message.id">
    <div 
      class="bg-white rounded-xl shadow-soft hover:shadow-lg transition-shadow duration-200"
      :class="{
        'p-4': settingsStore.showDetails,
        'p-3': !settingsStore.showDetails
      }"
    >
      <div v-if="!isEditing" class="text-gray-700 whitespace-pre-wrap break-words">
        <div 
          v-html="formattedContent"
          @click="handleHashtagClick"
        ></div>
        <UrlMetadataDisplay
          v-if="settingsStore.showDetails"
          v-for="url in urls"
          :key="url"
          :url="url"
        />
      </div>
      <textarea
        v-else
        ref="textareaRef"
        v-model="editedContent"
        class="w-full p-2 border rounded-lg focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 resize-none"
        @input="adjustHeight"
        @keydown="handleKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      ></textarea>

      <div 
        v-if="settingsStore.showDetails"
        class="mt-2 flex items-center justify-between"
      >
        <div v-if="settingsStore.showTimestamps" class="text-xs text-gray-500">
          {{ formatMessageDate(message.timestamp) }}
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center gap-2">
          <button
            v-if="!isEditing"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="toggleHistory"
            title="編集履歴を表示"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            v-if="!isEditing"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="startEdit"
            title="メッセージを編集"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            v-if="!isEditing"
            class="text-gray-400 hover:text-red-500 p-1"
            @click="deleteMessage"
            title="メッセージを削除"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <template v-else>
            <button
              class="text-green-500 hover:text-green-600 p-1"
              @click="saveEdit"
              title="保存"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              class="text-red-500 hover:text-red-600 p-1"
              @click="cancelEdit"
              title="キャンセル"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>
        </div>
      </div>

      <!-- 編集履歴 -->
      <div v-if="showHistory && settingsStore.showDetails" class="mt-4 border-t pt-4 space-y-4">
        <h4 class="text-sm font-medium text-gray-700">編集履歴</h4>
        <div
          v-for="(history, index) in messageHistory"
          :key="index"
          class="text-sm text-gray-600 border-l-2 border-gray-200 pl-4"
        >
          <div class="whitespace-pre-wrap break-words">{{ history.content }}</div>
          <div v-if="settingsStore.showTimestamps" class="text-xs text-gray-500 mt-1">
            {{ formatMessageDate(history.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>