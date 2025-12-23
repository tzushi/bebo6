import { ref, onMounted, onUnmounted } from 'vue'
import { isMobileDevice } from '../utils/deviceDetection'

export function useKeyboardAware(elementRef) {
  const isKeyboardVisible = ref(false)

  const handleFocus = () => {
    if (!elementRef.value || !isMobileDevice()) return
    elementRef.value.style.position = 'static'
    isKeyboardVisible.value = true
  }

  const handleBlur = () => {
    if (!elementRef.value || !isMobileDevice()) return
    elementRef.value.style.position = 'fixed'
    isKeyboardVisible.value = false
  }

  onMounted(() => {
    const input = elementRef.value?.querySelector('input, textarea')
    if (input) {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    }
  })

  onUnmounted(() => {
    const input = elementRef.value?.querySelector('input, textarea')
    if (input) {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
    }
  })

  return { isKeyboardVisible }
}