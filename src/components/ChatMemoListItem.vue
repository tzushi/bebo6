<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useSearchStore } from '../stores/search'
import { useRouter, useRoute } from 'vue-router'
import { isMobileDevice } from '../utils/deviceDetection'
import { linkifyHashtags } from '../utils/hashtagUtils'
import { formatChatMemoTimestamp, truncateMessage } from '../utils/chatMemoUtils'

const props = defineProps({
  chatMemo: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const route = useRoute()
const router = useRouter()
const store = useChatStore()
const searchStore = useSearchStore()
const editingTitle = ref(false)
const editTitle = ref('')
const isComposing = ref(false)
const showActions = ref(false)

const latestMessage = computed(() => {
  if (searchStore.isLoading) return null
  return searchStore.allMessages
    .filter(m => m.chat_memo_id === props.chatMemo.id && !m.is_deleted)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null
})

const formattedTimestamp = computed(() => {
  if (!props.chatMemo.updated_at) return ''
  return formatChatMemoTimestamp(props.chatMemo.updated_at)
})

const itemClasses = computed(() => {
  return {
    'bg-gray-100': props.isActive && !props.chatMemo.is_starred,
    'bg-yellow-50 hover:bg-yellow-75': props.chatMemo.is_starred && !props.isActive,
    'bg-yellow-200': props.chatMemo.is_starred && props.isActive,
    'hover:bg-gray-50': !props.chatMemo.is_starred && !props.isActive
  }
})

const startEdit = (event) => {
  event.preventDefault()
  event.stopPropagation()
  editingTitle.value = true
  editTitle.value = props.chatMemo.title
  showActions.value = false
}

const saveEdit = async () => {
  if (!editTitle.value.trim()) {
    cancelEdit()
    return
  }
  
  if (editTitle.value !== props.chatMemo.title) {
    await store.updateChatMemoTitle(props.chatMemo.id, editTitle.value)
  }
  
  editingTitle.value = false
  showActions.value = false
}

const handleEditKeydown = async (e) => {
  if (isMobileDevice()) return
  if (isComposing.value) return

  if (e.key === 'Enter') {
    e.preventDefault()
    await saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingTitle.value = false
  editTitle.value = ''
  showActions.value = false
}

const selectChatMemo = () => {
  if (!editingTitle.value) {
    emit('select', props.chatMemo)
  }
}

const toggleStar = async (event) => {
  event.preventDefault()
  event.stopPropagation()
  await store.toggleStar(props.chatMemo.id)
  showActions.value = false
}

const deleteChatMemo = async (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (Number(route.params.id) === props.chatMemo.id) {
    await router.push({ name: 'home' })
  }
  
  await store.deleteChatMemo(props.chatMemo.id)
  showActions.value = false
}

const handleHashtagClick = (event) => {
  const hashtag = event.target.dataset.hashtag
  if (hashtag) {
    event.preventDefault()
    event.stopPropagation()
    if (searchStore.selectedHashtag === `#${hashtag}`) {
      searchStore.setSelectedHashtag(null)
    } else {
      searchStore.setSelectedHashtag(`#${hashtag}`)
    }
  }
}

const formattedPreview = computed(() => {
  if (!latestMessage.value) return ''
  const content = truncateMessage(latestMessage.value.content, 100)
  return linkifyHashtags(content)
})

const toggleActions = (event) => {
  event.preventDefault()
  event.stopPropagation()
  showActions.value = !showActions.value
}
</script>

<template>
  <div class="group px-4">
    <div
      v-if="!editingTitle"
      class="block py-3 transition rounded cursor-pointer relative"
      :class="itemClasses"
      @click="selectChatMemo"
    >
      <div class="flex items-start gap-3">
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div 
              class="font-medium text-gray-900 truncate transition-all duration-200"
              v-html="linkifyHashtags(chatMemo.title)"
              @click="handleHashtagClick"
              :title="chatMemo.title"
            ></div>
            <!-- More Actions Button -->
            <button
              class="p-1 text-gray-400 hover:text-gray-600"
              @click="toggleActions"
              title="メニューを開く"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-gray-500">{{ formattedTimestamp }}</span>
            <div 
              v-if="latestMessage" 
              class="text-sm text-gray-500 truncate"
              v-html="formattedPreview"
              @click="handleHashtagClick"
            ></div>
          </div>
        </div>

        <!-- Action Menu -->
        <div 
          v-if="showActions"
          class="absolute top-0 right-0 mt-8 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          @click.stop
        >
          <div class="py-1">
            <button
              @click="toggleStar"
              class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
                :class="chatMemo.is_starred ? 'text-yellow-400' : 'text-gray-400'"
                fill="currentColor"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {{ chatMemo.is_starred ? 'スターを外す' : 'スターを付ける' }}
            </button>
            <button
              @click="startEdit"
              class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              タイトルを編集
            </button>
            <button
              @click="deleteChatMemo"
              class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div
      v-else
      class="flex items-center py-2 bg-gray-100 rounded"
    >
      <input
        v-model="editTitle"
        type="text"
        class="flex-1 rounded border p-1 text-sm mr-2 mx-2"
        @keydown="handleEditKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
        v-focus
      />
      <div class="flex gap-1 shrink-0 mr-2">
        <button
          @click="saveEdit"
          class="text-green-600 hover:text-green-700 p-1"
          title="保存"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          @click="cancelEdit"
          class="text-red-600 hover:text-red-700 p-1"
          title="キャンセル"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>