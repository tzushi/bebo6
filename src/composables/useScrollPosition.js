import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useScrollPosition(containerId) {
  const route = useRoute()
  const containerRef = ref(null)
  const scrollPosition = ref(0)
  const isNavigating = ref(false)
  const lastVisibleElementId = ref(null)
  const lastVisibleElementOffset = ref(0)

  const findLastVisibleElement = () => {
    if (!containerRef.value) return null

    const container = containerRef.value
    const messages = container.querySelectorAll('.message')
    const containerRect = container.getBoundingClientRect()

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]
      const messageRect = message.getBoundingClientRect()
      
      if (messageRect.top <= containerRect.bottom) {
        return {
          id: message.dataset.messageId,
          offset: containerRect.bottom - messageRect.top
        }
      }
    }
    
    return null
  }

  const saveScrollPosition = () => {
    if (!containerRef.value) return

    const visibleElement = findLastVisibleElement()
    if (visibleElement) {
      lastVisibleElementId.value = visibleElement.id
      lastVisibleElementOffset.value = visibleElement.offset
    }

    localStorage.setItem(
      `scroll-position-${containerId}-${route.name}`,
      JSON.stringify({
        scrollTop: containerRef.value.scrollTop,
        elementId: lastVisibleElementId.value,
        offset: lastVisibleElementOffset.value
      })
    )
  }

  const restoreScrollPosition = () => {
    const savedPositionJson = localStorage.getItem(`scroll-position-${containerId}-${route.name}`)
    if (!savedPositionJson || !containerRef.value) return false

    try {
      const savedPosition = JSON.parse(savedPositionJson)
      
      if (savedPosition.elementId) {
        const element = containerRef.value.querySelector(`[data-message-id="${savedPosition.elementId}"]`)
        if (element) {
          const elementRect = element.getBoundingClientRect()
          const containerRect = containerRef.value.getBoundingClientRect()
          const newScrollTop = elementRect.top + containerRef.value.scrollTop - containerRect.top - savedPosition.offset
          containerRef.value.scrollTop = newScrollTop
          return true
        }
      }
      
      // Fallback to saved scroll position if element-based restoration fails
      containerRef.value.scrollTop = savedPosition.scrollTop
      return true
    } catch (error) {
      console.error('Error restoring scroll position:', error)
      return false
    }
  }

  const handleScroll = () => {
    if (containerRef.value && !isNavigating.value) {
      scrollPosition.value = containerRef.value.scrollTop
      saveScrollPosition()
    }
  }

  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }

  watch(() => route.fullPath, (newPath, oldPath) => {
    if (oldPath) {
      isNavigating.value = true
      saveScrollPosition()
    }
  })

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll)
      
      setTimeout(() => {
        isNavigating.value = false
        if (!restoreScrollPosition()) {
          scrollToBottom()
        }
      }, 100)
    }
  })

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
      saveScrollPosition()
    }
  })

  return {
    containerRef,
    scrollPosition,
    saveScrollPosition,
    restoreScrollPosition,
    scrollToBottom
  }
}