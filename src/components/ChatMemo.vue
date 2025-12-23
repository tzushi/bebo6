<template>
  <div class="flex flex-col h-full">
    <!-- Search Panel -->
    <div
      v-show="searchStore.showSearch"
      class="px-4 space-y-4 border-b pb-4"
    >
      <SearchInput
        v-model="searchStore.memoSearchQuery"
        placeholder="メッセージを検索..."
      />
      <DateRangeSearch
        v-model:startDate="searchStore.startDate"
        v-model:endDate="searchStore.endDate"
      />
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4"
    >
      <div class="max-w-3xl mx-auto space-y-4 mb-4">
        <Message
          v-for="message in searchStore.filteredMessages"
          :key="message.id"
          :message="message"
          @edit-complete="handleMessageEdit"
        />
      </div>
    </div>

    <!-- Fixed Message Input -->
    <div
      ref="inputContainer"
      class="footer"
      :class="{ 'static': isKeyboardVisible }"
    >
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex gap-2">
          <textarea
            ref="messageInput"
            v-model="newMessage"
            placeholder="メッセージを入力..."
            class="flex-1 rounded-lg border-gray-200 p-3 focus:border-black focus:ring focus:ring-black/20 focus:ring-opacity-50 transition-shadow duration-200 resize-none"
            :rows="1"
            @input="$event.target.style.height = '0'; $event.target.style.height = $event.target.scrollHeight + 'px'"
            @keydown="(e) => handleKeydown(e, sendMessage)"
            @compositionstart="isComposing = true"
            @compositionend="isComposing = false"
          />
          <button
            @click="sendMessage"
            class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-black/20 transition-all duration-200 flex items-center justify-center btn-hover-effect shrink-0"
            title="送信"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <WelcomeDialog
      :show="showWelcomeDialog"
      @close="handleWelcomeClose"
    />

    <UndoNotification
      :show="!!store.deletedMessage"
      message="メッセージを削除しました"
      @undo="store.undoMessageDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '../stores/chat'
import { useSearchStore } from '../stores/search'
import { useSettingsStore } from '../stores/settings'
import { useMessageInput } from '../composables/useMessageInput'
import { useKeyboardAware } from '../composables/useKeyboardAware'
import SearchInput from './SearchInput.vue'
import DateRangeSearch from './DateRangeSearch.vue'
import Message from './Message.vue'
import WelcomeDialog from './WelcomeDialog.vue'
import UndoNotification from './UndoNotification.vue'

const route = useRoute()
const store = useChatStore()
const searchStore = useSearchStore()
const settingsStore = useSettingsStore()
const messagesContainer = ref(null)
const inputContainer = ref(null)
const showWelcomeDialog = ref(false)
const editedMessageId = ref(null)

const { isKeyboardVisible } = useKeyboardAware(inputContainer)

const {
  messageInput,
  newMessage,
  isComposing,
  focusMessageInput,
  handleKeydown,
  clearMessage
} = useMessageInput()

// ... 残りのコードは変更なし
</script>