export function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
  return text.match(urlRegex) || []
}