// Composable for handling temporary messages
import { ref } from 'vue'

export function useMessage(timeout = 3000) {
  const message = ref('')
  const error = ref('')
  let timeoutId = null

  const showMessage = (text) => {
    message.value = text
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      message.value = ''
    }, timeout)
  }

  const showError = (text) => {
    error.value = text
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      error.value = ''
    }, timeout)
  }

  const clearMessages = () => {
    message.value = ''
    error.value = ''
    if (timeoutId) clearTimeout(timeoutId)
  }

  return {
    message,
    error,
    showMessage,
    showError,
    clearMessages
  }
}