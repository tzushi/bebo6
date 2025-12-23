import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'
import { useLocalStorage } from '@vueuse/core'
import * as chatMemoService from '../services/chatMemo'
import * as messageService from '../services/message'
import { sortChatMemos } from '../utils/sortUtils'

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore()
  const chatMemos = ref([])
  const currentChatMemo = ref(null)
  const messages = ref([])
  const deletedChatMemoId = ref(null)
  const deletedChatMemoData = ref(null)
  const deletedMessage = ref(null)
  const undoTimer = ref(null)
  const error = ref(null)
  const isCreating = ref(false)
  const deletedMemoIndex = ref(-1)
  const lastEditedMemoId = useLocalStorage('last-edited-memo-id', null)

  const currentChatMemoTitle = computed(() => {
    return currentChatMemo.value?.title || ''
  })

  async function createChatMemo(title = '新しいチャットメモ') {
    try {
      if (!authStore.currentUser || isCreating.value) return null
      
      isCreating.value = true
      const chatMemo = await chatMemoService.create(
        authStore.currentUser.id,
        title
      )
      
      if (!chatMemo) {
        throw new Error('チャットメモの作成に失敗しました')
      }

      chatMemos.value = sortChatMemos([chatMemo, ...chatMemos.value])
      return chatMemo.id
    } catch (err) {
      console.error('Failed to create chat memo:', err)
      error.value = 'チャットメモの作成に失敗しました'
      return null
    } finally {
      isCreating.value = false
    }
  }

  async function loadChatMemos() {
    try {
      if (!authStore.currentUser) {
        chatMemos.value = []
        return
      }

      const memos = await chatMemoService.getAll(authStore.currentUser.id)
      chatMemos.value = sortChatMemos(memos)
    } catch (err) {
      console.error('Failed to load chat memos:', err)
      error.value = 'チャットメモの読み込みに失敗しました'
      chatMemos.value = []
    }
  }

  async function loadChatMemo(chatMemoId) {
    const memo = chatMemos.value.find(m => m.id === chatMemoId)
    if (memo?.user_id === authStore.currentUser?.id) {
      currentChatMemo.value = memo
    } else {
      currentChatMemo.value = null
    }
  }

  async function loadMessages(chatMemoId) {
    try {
      await loadChatMemo(chatMemoId)
      const loadedMessages = await messageService.getAll(chatMemoId)
      messages.value = loadedMessages
    } catch (err) {
      console.error('Failed to load messages:', err)
      error.value = 'メッセージの読み込みに失敗しました'
      messages.value = []
    }
  }

  async function addMessage(chatMemoId, content) {
    try {
      const message = await messageService.create(chatMemoId, content)
      messages.value.push(message)
      
      if (messages.value.length === 1 && !currentChatMemo.value?.title_modified) {
        const updatedMemo = await chatMemoService.updateTitleFromFirstMessage(chatMemoId, content)
        if (updatedMemo) {
          const index = chatMemos.value.findIndex(m => m.id === chatMemoId)
          if (index !== -1) {
            chatMemos.value[index] = updatedMemo
          }
          currentChatMemo.value = updatedMemo
        }
      }
      
      await updateChatMemoTimestamp(chatMemoId)
    } catch (err) {
      console.error('Failed to add message:', err)
      error.value = 'メッセージの追加に失敗しました'
    }
  }

  async function editMessage(messageId, content) {
    try {
      const updatedMessage = await messageService.update(messageId, content)
      const index = messages.value.findIndex(m => m.id === messageId)
      if (index !== -1) {
        messages.value[index] = updatedMessage
      }
    } catch (err) {
      console.error('Failed to edit message:', err)
      error.value = 'メッセージの編集に失敗しました'
    }
  }

  async function deleteMessage(messageId) {
    try {
      const message = messages.value.find(m => m.id === messageId)
      if (!message) return

      deletedMessage.value = { ...message }
      const index = messages.value.findIndex(m => m.id === messageId)
      if (index !== -1) {
        messages.value[index] = { ...message, is_deleted: true }
      }

      await messageService.remove(messageId)

      if (undoTimer.value) {
        clearTimeout(undoTimer.value)
      }

      undoTimer.value = setTimeout(() => {
        deletedMessage.value = null
      }, 5000)
    } catch (err) {
      const index = messages.value.findIndex(m => m.id === messageId)
      if (index !== -1 && deletedMessage.value) {
        messages.value[index] = deletedMessage.value
      }

      console.error('Failed to delete message:', err)
      error.value = 'メッセージの削除に失敗しました'
      deletedMessage.value = null
    }
  }

  async function undoMessageDelete() {
    try {
      if (!deletedMessage.value) return

      const messageId = deletedMessage.value.id
      const index = messages.value.findIndex(m => m.id === messageId)
      
      if (index !== -1) {
        messages.value[index] = { ...deletedMessage.value, is_deleted: false }
        await messageService.restore(messageId)
      }
    } catch (err) {
      console.error('Failed to undo message delete:', err)
      error.value = 'メッセージの復元に失敗しました'
      
      const index = messages.value.findIndex(m => m.id === deletedMessage.value.id)
      if (index !== -1) {
        messages.value[index] = { ...deletedMessage.value, is_deleted: true }
      }
    } finally {
      deletedMessage.value = null
      if (undoTimer.value) {
        clearTimeout(undoTimer.value)
        undoTimer.value = null
      }
    }
  }

  async function updateChatMemoTitle(chatMemoId, title) {
    try {
      const updatedMemo = await chatMemoService.update(chatMemoId, {
        title,
        title_modified: true,
        updated_at: new Date().toISOString()
      })
      
      const index = chatMemos.value.findIndex(m => m.id === chatMemoId)
      if (index !== -1) {
        chatMemos.value[index] = updatedMemo
      }
      
      if (currentChatMemo.value?.id === chatMemoId) {
        currentChatMemo.value = updatedMemo
      }
    } catch (err) {
      console.error('Failed to update chat memo title:', err)
      error.value = 'チャットメモのタイトル更新に失敗しました'
    }
  }

  async function toggleStar(chatMemoId) {
    try {
      const memo = chatMemos.value.find(m => m.id === chatMemoId)
      if (!memo) return

      const updatedMemo = await chatMemoService.update(chatMemoId, {
        is_starred: !memo.is_starred,
        updated_at: new Date().toISOString()
      })
      
      const index = chatMemos.value.findIndex(m => m.id === chatMemoId)
      if (index !== -1) {
        chatMemos.value[index] = updatedMemo
      }
      
      if (currentChatMemo.value?.id === chatMemoId) {
        currentChatMemo.value = updatedMemo
      }

      chatMemos.value = sortChatMemos(chatMemos.value)
    } catch (err) {
      console.error('Failed to toggle star:', err)
      error.value = 'スター設定の更新に失敗しました'
    }
  }

  async function deleteChatMemo(chatMemoId) {
    try {
      const memo = chatMemos.value.find(m => m.id === chatMemoId)
      if (!memo) return

      deletedChatMemoId.value = chatMemoId
      deletedChatMemoData.value = { ...memo }
      deletedMemoIndex.value = chatMemos.value.findIndex(m => m.id === chatMemoId)
      
      chatMemos.value = chatMemos.value.filter(m => m.id !== chatMemoId)
      await chatMemoService.remove(chatMemoId)

      if (undoTimer.value) {
        clearTimeout(undoTimer.value)
      }

      undoTimer.value = setTimeout(() => {
        deletedChatMemoId.value = null
        deletedChatMemoData.value = null
        deletedMemoIndex.value = -1
      }, 5000)
    } catch (err) {
      console.error('Failed to delete chat memo:', err)
      error.value = 'チャットメモの削除に失敗しました'
    }
  }

  async function undoDelete() {
    try {
      if (!deletedChatMemoId.value || !deletedChatMemoData.value) return

      const restoredMemo = await chatMemoService.undoDelete(
        authStore.currentUser.id,
        deletedChatMemoId.value
      )

      if (restoredMemo) {
        if (deletedMemoIndex.value !== -1) {
          chatMemos.value.splice(deletedMemoIndex.value, 0, restoredMemo)
        } else {
          chatMemos.value.push(restoredMemo)
        }
      }
    } catch (err) {
      console.error('Failed to undo delete:', err)
      error.value = 'チャットメモの復元に失敗しました'
    } finally {
      deletedChatMemoId.value = null
      deletedChatMemoData.value = null
      deletedMemoIndex.value = -1
      if (undoTimer.value) {
        clearTimeout(undoTimer.value)
        undoTimer.value = null
      }
    }
  }

  async function updateChatMemoTimestamp(chatMemoId) {
    try {
      const updatedMemo = await chatMemoService.update(chatMemoId, {
        updated_at: new Date().toISOString()
      })
      
      const index = chatMemos.value.findIndex(m => m.id === chatMemoId)
      if (index !== -1) {
        chatMemos.value[index] = updatedMemo
      }
      
      if (currentChatMemo.value?.id === chatMemoId) {
        currentChatMemo.value = updatedMemo
      }

      chatMemos.value = sortChatMemos(chatMemos.value)
    } catch (err) {
      console.error('Failed to update chat memo timestamp:', err)
    }
  }

  async function getMessageHistory(messageId) {
    try {
      return await messageService.getHistory(messageId)
    } catch (err) {
      console.error('Failed to get message history:', err)
      error.value = 'メッセージ履歴の取得に失敗しました'
      return []
    }
  }

  watch(error, (newError) => {
    if (newError) {
      setTimeout(() => {
        error.value = null
      }, 5000)
    }
  })

  return {
    chatMemos,
    currentChatMemo,
    currentChatMemoTitle,
    messages,
    deletedMessage,
    deletedChatMemoId,
    deletedChatMemoData,
    error,
    isCreating,
    lastEditedMemoId,
    createChatMemo,
    loadChatMemos,
    loadChatMemo,
    loadMessages,
    addMessage,
    editMessage,
    deleteMessage,
    undoMessageDelete,
    updateChatMemoTitle,
    toggleStar,
    deleteChatMemo,
    undoDelete,
    getMessageHistory,
    setLastEditedMemoId(id) {
      lastEditedMemoId.value = id
    }
  }
})