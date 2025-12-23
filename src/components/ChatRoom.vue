<script setup>
import { ref, onMounted, watch } from 'vue'
import { useChatStore } from '../stores/chat'
import { useRoute } from 'vue-router'
import { formatMessageDate } from '../utils/dateFormat'
import { isMobileDevice } from '../utils/deviceDetection'
import WelcomeDialog from './WelcomeDialog.vue'

const route = useRoute()
const store = useChatStore()
const newMessage = ref('')
const messagesContainer = ref(null)
const messageInput = ref(null)
const showWelcomeDialog = ref(false)
const isComposing = ref(false)

const currentRoomId = ref(Number(route.params.id))

onMounted(async () => {
  await store.loadMessages(currentRoomId.value)
  scrollToBottom()
  
  if (route.query.welcome === 'true') {
    showWelcomeDialog.value = true
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    currentRoomId.value = Number(newId)
    await store.loadMessages(currentRoomId.value)
    scrollToBottom()
  }
})

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  await store.addMessage(currentRoomId.value, newMessage.value)
  newMessage.value = ''
  scrollToBottom()
}

const handleKeydown = async (e) => {
  if (isMobileDevice()) return
  if (isComposing.value) return

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    await sendMessage()
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }, 100)
  }
}

const handleWelcomeClose = () => {
  showWelcomeDialog.value = false
  if (messageInput.value) {
    messageInput.value.focus()
  }
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-105px)]">
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-4 mb-4 px-4"
    >
      <div 
        v-for="message in store.messages" 
        :key="message.id" 
        class="message animate-slide-in"
      >
        <div class="bg-white rounded-xl shadow-soft p-4 hover:shadow-lg transition-shadow duration-200">
          <div class="text-gray-700 whitespace-pre-wrap break-words">{{ message.content }}</div>
          <div class="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatMessageDate(message.timestamp) }}
          </div>
        </div>
      </div>
    </div>
    <div class="border-t bg-white rounded-lg shadow-soft p-4">
      <div class="flex gap-2">
        <input
          ref="messageInput"
          v-model="newMessage"
          type="text"
          placeholder="メッセージを入力..."
          class="flex-1 rounded-lg border-gray-200 p-3 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 transition-shadow duration-200"
          @keydown="handleKeydown"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />
        <button
          @click="sendMessage"
          class="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all duration-200 flex items-center justify-center btn-hover-effect"
          title="送信"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
    
    <WelcomeDialog
      :show="showWelcomeDialog"
      @close="handleWelcomeClose"
    />
  </div>
</template>