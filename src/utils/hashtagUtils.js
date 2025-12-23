export function extractHashtags(text) {
  const hashtagRegex = /#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+/g
  return text.match(hashtagRegex) || []
}

export function linkifyHashtags(text) {
  return text.replace(
    /#([\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+)/g,
    '<a href="#" class="text-primary-600 hover:text-primary-700" data-hashtag="$1">#$1</a>'
  )
}