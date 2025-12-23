import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useChatStore } from './chat'
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns'
import { extractHashtags } from '../utils/hashtagUtils'
import { supabase } from '../config/supabase'

export const useSearchStore = defineStore('search', () => {
  const chatStore = useChatStore()
  const globalSearchQuery = ref('')
  const memoSearchQuery = ref('')
  const currentMemoId = ref(null)
  const allMessages = ref([])
  const startDate = ref(null)
  const endDate = ref(null)
  const selectedHashtag = ref(null)
  const isLoading = ref(true)
  const showSearch = ref(false)

  const searchResults = computed(() => {
    if (!globalSearchQuery.value.trim() && !startDate.value && !endDate.value && !selectedHashtag.value) {
      return chatStore.chatMemos
    }

    const query = globalSearchQuery.value.toLowerCase().trim()
    const memoMatches = new Set()

    // Search through chat memos
    chatStore.chatMemos.forEach(memo => {
      const titleMatches = memo.title.toLowerCase().includes(query)
      const titleHashtags = extractHashtags(memo.title)
      const hashtagMatches = selectedHashtag.value ? 
        titleHashtags.includes(selectedHashtag.value) : true

      if ((titleMatches && hashtagMatches) || (!query && hashtagMatches)) {
        memoMatches.add(memo.id)
      }
    })

    // Search through messages
    allMessages.value.forEach(message => {
      if (!message.is_deleted) {
        const contentMatches = query ? 
          message.content.toLowerCase().includes(query) : true
        const messageHashtags = extractHashtags(message.content)
        const hashtagMatches = selectedHashtag.value ? 
          messageHashtags.includes(selectedHashtag.value) : true
        const dateMatches = isWithinDateRange(message.timestamp)

        if ((contentMatches && hashtagMatches && dateMatches) || (!query && hashtagMatches)) {
          memoMatches.add(message.chat_memo_id)
        }
      }
    })

    return chatStore.chatMemos.filter(memo => memoMatches.has(memo.id))
  })

  const filteredMessages = computed(() => {
    const messages = chatStore.messages.filter(message => !message.is_deleted)

    if (!currentMemoId.value) return []

    // If there's a selected hashtag but no messages in this memo contain it,
    // show all messages
    if (selectedHashtag.value) {
      const hasHashtagInMessages = messages.some(message => 
        extractHashtags(message.content).includes(selectedHashtag.value)
      )
      
      if (!hasHashtagInMessages) {
        // Check if the hashtag is in the memo title
        const currentMemo = chatStore.chatMemos.find(memo => memo.id === currentMemoId.value)
        const hasHashtagInTitle = currentMemo && 
          extractHashtags(currentMemo.title).includes(selectedHashtag.value)
        
        if (hasHashtagInTitle) {
          return messages
        }
      }
    }

    if (!memoSearchQuery.value.trim() && !startDate.value && !endDate.value && !selectedHashtag.value) {
      return messages
    }

    return messages.filter(message => {
      const contentMatch = memoSearchQuery.value ? 
        message.content.toLowerCase().includes(memoSearchQuery.value.toLowerCase()) : true
      const dateMatch = isWithinDateRange(message.timestamp)
      const hashtagMatch = selectedHashtag.value ? 
        extractHashtags(message.content).includes(selectedHashtag.value) : true

      return contentMatch && dateMatch && hashtagMatch
    })
  })

  const allHashtags = computed(() => {
    const hashtags = new Set()

    chatStore.chatMemos.forEach(memo => {
      extractHashtags(memo.title).forEach(tag => hashtags.add(tag))
    })

    allMessages.value.forEach(message => {
      if (!message.is_deleted) {
        extractHashtags(message.content).forEach(tag => hashtags.add(tag))
      }
    })

    return Array.from(hashtags).sort()
  })

  function isWithinDateRange(timestamp) {
    if (!startDate.value && !endDate.value) return true
    
    const messageDate = parseISO(timestamp)
    const start = startDate.value ? startOfDay(parseISO(startDate.value)) : null
    const end = endDate.value ? endOfDay(parseISO(endDate.value)) : null

    if (start && end) {
      return isWithinInterval(messageDate, { start, end })
    } else if (start) {
      return messageDate >= start
    } else if (end) {
      return messageDate <= end
    }
    
    return true
  }

  async function loadAllMessages() {
    isLoading.value = true
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('is_deleted', false)
      
      if (error) throw error
      allMessages.value = messages || []
    } catch (error) {
      console.error('Error loading messages:', error)
      allMessages.value = []
    } finally {
      isLoading.value = false
    }
  }

  function setCurrentMemoId(memoId) {
    if (currentMemoId.value !== memoId) {
      currentMemoId.value = memoId
      if (!selectedHashtag.value) {
        clearMemoSearch()
      }
    }
  }

  function setSelectedHashtag(hashtag) {
    // Toggle off if clicking the same hashtag
    if (selectedHashtag.value === hashtag) {
      selectedHashtag.value = null
    } else {
      selectedHashtag.value = hashtag
    }
  }

  function toggleSearch() {
    showSearch.value = !showSearch.value
    if (!showSearch.value) {
      clearMemoSearch()
    }
  }

  function clearGlobalSearch() {
    globalSearchQuery.value = ''
    startDate.value = null
    endDate.value = null
    selectedHashtag.value = null
  }

  function clearMemoSearch() {
    memoSearchQuery.value = ''
    startDate.value = null
    endDate.value = null
    showSearch.value = false
  }

  return {
    globalSearchQuery,
    memoSearchQuery,
    startDate,
    endDate,
    selectedHashtag,
    isLoading,
    showSearch,
    searchResults,
    filteredMessages,
    allHashtags,
    allMessages,
    loadAllMessages,
    setCurrentMemoId,
    setSelectedHashtag,
    toggleSearch,
    clearGlobalSearch,
    clearMemoSearch
  }
})