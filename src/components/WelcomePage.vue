<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'
import { useRouter } from 'vue-router'

const router = useRouter()
const chatStore = useChatStore()
const loading = ref(true)

onMounted(async () => {
  await chatStore.loadChatMemos()
  
  if (chatStore.lastEditedMemoId) {
    // Check if the memo still exists
    const memo = chatStore.chatMemos.find(m => m.id === chatStore.lastEditedMemoId)
    if (memo) {
      router.replace({ 
        name: 'memo', 
        params: { id: memo.id.toString() }
      })
      return
    }
  }
  
  loading.value = false
})
</script>

<template>
  <div v-if="!loading" class="flex items-center justify-center h-[calc(100vh-105px)]">
    <div class="text-center max-w-lg px-4">
      <p class="text-xl text-gray-700">
        対話するようにメモを書こう！
      </p>
    </div>
  </div>
</template>