import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '../stores/chat'

const BASE_TITLE = 'bebo6（ビーボシックス）- チャットでメモる、新発想のノートアプリ'
const BASE_DESCRIPTION = 'bebo6（ビーボシックス、ビボーロク）は、あなたの思考をチャット形式で記録できる新しいメモアプリです。自分との対話を通じて、アイデアを整理し、考えを深めることができます。'

export function useMetaTags() {
  const route = useRoute()
  const chatStore = useChatStore()

  const updateMetaTags = () => {
    let title = BASE_TITLE
    let description = BASE_DESCRIPTION

    // メモページの場合はタイトルを変更
    if (route.name === 'memo' && chatStore.currentChatMemoTitle) {
      title = `${chatStore.currentChatMemoTitle} | ${BASE_TITLE}`
    }

    // titleタグ
    document.title = title

    // meta description
    updateMetaTag('description', description)

    // OGP
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:type', 'website', 'property')
    updateMetaTag('og:url', window.location.href, 'property')
    updateMetaTag('og:site_name', 'bebo6', 'property')
    updateMetaTag('twitter:card', 'summary_large_image', 'property')
  }

  // ルート変更時にメタタグを更新
  watch(() => [route.fullPath, chatStore.currentChatMemoTitle], updateMetaTags, { immediate: true })

  return { updateMetaTags }
}

function updateMetaTag(name, content, attributeName = 'name') {
  let element = document.querySelector(`meta[${attributeName}="${name}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}