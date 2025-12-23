import { ref } from 'vue'
import { isMobileDevice } from '../utils/deviceDetection'

export function useMessageInput() {
  const messageInput = ref(null)
  const newMessage = ref('')
  const isComposing = ref(false)

  const focusMessageInput = () => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  }

  const handleKeydown = async (e, sendMessage) => {
    if (isMobileDevice()) return
    if (isComposing.value) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await sendMessage()
    }
  }

  const clearMessage = () => {
    newMessage.value = ''
    if (messageInput.value) {
      messageInput.value.style.height = 'auto'
    }
  }

  return {
    messageInput,
    newMessage,
    isComposing,
    focusMessageInput,
    handleKeydown,
    clearMessage
  }
}