import { onMounted, onUnmounted } from 'vue'

export function useViewportHeight() {
  let resizeTimeout

  const setViewportHeight = () => {
    // Cancel any pending resize
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    // Delay execution to avoid rapid updates
    resizeTimeout = setTimeout(() => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 100)
  }

  onMounted(() => {
    // Initial setup
    setViewportHeight()

    // Handle various events that might affect viewport height
    window.addEventListener('resize', setViewportHeight, { passive: true })
    window.addEventListener('orientationchange', setViewportHeight)
    
    // Handle iOS Safari toolbar show/hide
    if ('standalone' in navigator && !navigator.standalone) {
      window.addEventListener('scroll', setViewportHeight, { passive: true })
      window.addEventListener('touchmove', setViewportHeight, { passive: true })
      window.addEventListener('touchend', setViewportHeight, { passive: true })
      
      // Handle iOS Safari keyboard show/hide
      window.visualViewport?.addEventListener('resize', setViewportHeight)
      window.visualViewport?.addEventListener('scroll', setViewportHeight)
    }
  })

  onUnmounted(() => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    window.removeEventListener('resize', setViewportHeight)
    window.removeEventListener('orientationchange', setViewportHeight)
    window.removeEventListener('scroll', setViewportHeight)
    window.removeEventListener('touchmove', setViewportHeight)
    window.removeEventListener('touchend', setViewportHeight)
    
    window.visualViewport?.removeEventListener('resize', setViewportHeight)
    window.visualViewport?.removeEventListener('scroll', setViewportHeight)
  })
}