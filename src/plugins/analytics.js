import { useRoute } from 'vue-router'

export function createAnalytics(app, router) {
  // Google Analytics タグ
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GXPX5ZBDTJ' // あなたの測定IDに置き換えてください
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-XXXXXXXXXX') // あなたの測定IDに置き換えてください

  // ルート変更時にページビューを送信
  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_title: to.name,
      page_path: to.fullPath
    })
  })
}