<script setup>
import { ref, onMounted, watch } from 'vue'
import { useChatStore } from '../stores/chat'
import { useSearchStore } from '../stores/search'
import { useRouter, useRoute } from 'vue-router'
import { isMobileDevice } from '../utils/deviceDetection'
import { linkifyHashtags } from '../utils/hashtagUtils'
import UndoNotification from './UndoNotification.vue'
import NewChatMemoInput from './NewChatMemoInput.vue'
import SearchInput from './SearchInput.vue'
import ChatMemoListItem from './ChatMemoListItem.vue'

const route = useRoute()
const router = useRouter()
const store = useChatStore()
const searchStore = useSearchStore()

const emit = defineEmits(['select-chatmemo'])

onMounted(async () => {
  await store.loadChatMemos()
  await searchStore.loadAllMessages()
})

watch(() => store.chatMemos, async () => {
  await searchStore.loadAllMessages()
}, { deep: true })

const selectChatMemo = (chatMemo) => {
  emit('select-chatmemo')
  router.push({ name: 'memo', params: { id: chatMemo.id.toString() }})
}
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Fixed New Chat Memo Input -->
    <div class="p-4 border-b">
      <NewChatMemoInput @create-success="$emit('select-chatmemo')" />
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Search Input (scrolls with content) -->
      <div class="p-4">
        <SearchInput
          v-model="searchStore.globalSearchQuery"
          placeholder="チャットメモを検索..."
        />
      </div>

      <!-- Chat Memo List -->
      <div class="py-2">
        <ChatMemoListItem
          v-for="chatMemo in searchStore.searchResults"
          :key="chatMemo.id"
          :chat-memo="chatMemo"
          :is-active="$route.params.id === String(chatMemo.id)"
          @select="selectChatMemo"
        />
      </div>
    </div>

    <UndoNotification
      :show="!!store.deletedChatMemoId"
      :message="`「${store.deletedChatMemoData?.title}」を削除しました`"
      @undo="store.undoDelete"
    />
  </div>
</template>