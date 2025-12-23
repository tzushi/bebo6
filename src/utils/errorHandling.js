import { ref } from 'vue'

// Global error state
const globalError = ref(null)

export function handleError(error, context = '') {
  console.error(`Error in ${context}:`, error)
  
  // Set a user-friendly error message
  if (error.name === 'FunctionsFetchError') {
    globalError.value = 'URLプレビューの取得に失敗しました'
  } else {
    globalError.value = error.message || 'エラーが発生しました'
  }

  // Clear error after 5 seconds
  setTimeout(() => {
    globalError.value = null
  }, 5000)
}

export function useGlobalError() {
  return { globalError }
}