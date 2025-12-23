import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useMessageScroll() {
  const route = useRoute()
  const containerRef = ref(null)
  const scrollPosition = ref(0)
  const isFromSettings = ref(false)
  const hasUrlMessages = ref(false)

  const scrollToBottom = () => {
    if (!containerRef.value) return
    
    requestAnimationFrame(() => {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    })
  }

  const scrollToMessage = (messageId) => {
    if (!containerRef.value) return

    requestAnimationFrame(() => {
      const messageElement = containerRef.value.querySelector(`[data-message-id="${messageId}"]`)
      if (messageElement) {
        const containerHeight = containerRef.value.clientHeight
        const messageTop = messageElement.offsetTop
        const messageHeight = messageElement.offsetHeight
        
        const scrollPosition = messageTop - (containerHeight - messageHeight) / 2
        containerRef.value.scrollTop = Math.max(0, scrollPosition)
      }
    })
  }

  const saveScrollPosition = () => {
    if (!containerRef.value) return

    // Find the first fully visible message
    const messages = containerRef.value.querySelectorAll('.message')
    const containerTop = containerRef.value.scrollTop
    const containerBottom = containerTop + containerRef.value.clientHeight

    for (const message of messages) {
      const messageTop = message.offsetTop
      const messageBottom = messageTop + message.offsetHeight

      if (messageTop >= containerTop && messageBottom <= containerBottom) {
        scrollPosition.value = messageTop
        break
      }
    }

    if (!scrollPosition.value) {
      scrollPosition.value = containerRef.value.scrollTop
    }
  }

  const restoreScrollPosition = () => {
    if (!containerRef.value || !scrollPosition.value) return
    
    requestAnimationFrame(() => {
      containerRef.value.scrollTop = scrollPosition.value
    })
  }

  const checkForUrlMessages = () => {
    if (!containerRef.value) return

    const messages = containerRef.value.querySelectorAll('.message')
    hasUrlMessages.value = Array.from(messages).some(message => 
      message.querySelector('a[href^="http"]')
    )
  }

  watch(() => route.name, (newRoute, oldRoute) => {
    if (oldRoute === 'profile' && newRoute === 'memo') {
      isFromSettings.value = true
    } else {
      isFromSettings.value = false
      scrollPosition.value = 0
    }
  })

  watch(() => route.params.id, () => {
    isFromSettings.value = false
    scrollPosition.value = 0
  })

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', saveScrollPosition)
      checkForUrlMessages()
    }
  })

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', saveScrollPosition)
    }
  })

  return {
    containerRef,
    scrollToBottom,
    scrollToMessage,
    isFromSettings,
    hasUrlMessages,
    saveScrollPosition,
    restoreScrollPosition
  }
}