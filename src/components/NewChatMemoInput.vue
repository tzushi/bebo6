<template>
  <div class="flex">
    <div class="flex-1 min-w-0 mr-2">
      <input
        v-model="newChatMemoTitle"
        type="text"
        placeholder="チャットメモのタイトル"
        class="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
        @keydown="handleKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />
    </div>
    <button
      @click="createNewChatMemo"
      class="bg-black text-white w-10 h-10 rounded-lg hover:bg-gray-900 flex items-center justify-center btn-hover-effect shrink-0"
      title="チャットメモを作成"
    >
      <svg 
        class="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'
import { useRouter } from 'vue-router'
import { isMobileDevice } from '../utils/deviceDetection'

const props = defineProps({
  onCreateSuccess: {
    type: Function,
    default: () => {}
  }
})

const router = useRouter()
const store = useChatStore()
const newChatMemoTitle = ref('')
const isComposing = ref(false)

const createNewChatMemo = async () => {
  const title = newChatMemoTitle.value.trim() || '新しいチャットメモ'
  const chatMemoId = await store.createChatMemo(title)
  
  if (chatMemoId) {
    newChatMemoTitle.value = ''
    await router.push({ 
      name: 'memo', 
      params: { id: chatMemoId.toString() }
    })
    props.onCreateSuccess()
  }
}

const handleKeydown = async (e) => {
  if (isMobileDevice()) return
  if (isComposing.value) return

  if (e.key === 'Enter') {
    e.preventDefault()
    await createNewChatMemo()
  }
}
</script>