import { onMounted, onBeforeUnmount } from 'vue'

export function useAutoResize(textareaRef) {
  const adjustHeight = () => {
    if (!textareaRef.value) return
    
    // Reset height to auto to get the correct scrollHeight
    textareaRef.value.style.height = 'auto'
    
    // Set the height to match the content
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }

  onMounted(() => {
    if (textareaRef.value) {
      adjustHeight()
    }
  })

  onBeforeUnmount(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })

  return {
    adjustHeight
  }
}